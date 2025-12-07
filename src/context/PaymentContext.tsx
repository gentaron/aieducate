import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { POLYGON_CHAIN_ID_HEX, USDC_ADDRESS, TREASURY_ADDRESS, COURSE_PRICE_USDC, ERC20_ABI } from '../config/web3';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface PaymentContextType {
    purchasedCourses: string[];
    isWalletConnected: boolean;
    walletAddress: string | null;
    chainId: string | null;
    connectWallet: () => Promise<void>;
    switchNetwork: () => Promise<void>;
    purchaseCourse: (courseId: string) => Promise<boolean>;
    checkAccess: (courseId: string) => boolean;
    paymentStatus: 'idle' | 'pending' | 'success' | 'error';
    errorMessage: string | null;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAccountsChanged = useCallback((accounts: string[]) => {
        if (accounts.length === 0) {
            setIsWalletConnected(false);
            setWalletAddress(null);
        } else {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
        }
    }, []);

    // Load purchases from API
    useEffect(() => {
        if (user) {
            fetch(`${API_URL}/api/purchases`, {
                credentials: 'include'
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data?.purchases) {
                        setPurchasedCourses(data.purchases.map((p: any) => p.courseId));
                    }
                })
                .catch(console.error);
        } else {
            setPurchasedCourses([]);
        }
    }, [user]);

    // Check wallet connection on load
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then((accounts: string[]) => {
                    if (accounts.length > 0) {
                        handleAccountsChanged(accounts);
                    }
                });

            window.ethereum.request({ method: 'eth_chainId' })
                .then((id: string) => setChainId(id));

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', (id: string) => {
                setChainId(id);
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        }
    }, [handleAccountsChanged]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            setErrorMessage("MetaMask is not installed!");
            return;
        }
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error: any) {
            console.error(error);
            setErrorMessage("Failed to connect wallet.");
        }
    };

    const switchNetwork = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: POLYGON_CHAIN_ID_HEX,
                                chainName: 'Polygon Mainnet',
                                nativeCurrency: {
                                    name: 'MATIC',
                                    symbol: 'MATIC',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://polygon-rpc.com/'],
                                blockExplorerUrls: ['https://polygonscan.com/'],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError);
                    setErrorMessage("Failed to add Polygon network.");
                }
            } else {
                console.error(switchError);
                setErrorMessage("Failed to switch network.");
            }
        }
    };

    const purchaseCourse = async (courseId: string) => {
        if (!user) {
            setErrorMessage("Please login first.");
            return false;
        }
        if (!isWalletConnected) {
            setErrorMessage("Please connect wallet first.");
            await connectWallet();
            return false;
        }

        setPaymentStatus('pending');
        setErrorMessage(null);

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const usdcContract = new Contract(USDC_ADDRESS, ERC20_ABI, signer);

            const amount = parseUnits(COURSE_PRICE_USDC, 6);

            const tx = await usdcContract.transfer(TREASURY_ADDRESS, amount);
            await tx.wait();

            // Record purchase in database
            const res = await fetch(`${API_URL}/api/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    courseId,
                    txHash: tx.hash,
                    amount: COURSE_PRICE_USDC
                })
            });

            if (!res.ok) {
                throw new Error('Failed to record purchase');
            }

            const newPurchases = [...purchasedCourses, courseId];
            setPurchasedCourses(newPurchases);

            setPaymentStatus('success');
            return true;

        } catch (error: any) {
            console.error(error);
            setPaymentStatus('error');
            if (error.code === 'ACTION_REJECTED' || error.info?.error?.code === 4001) {
                setErrorMessage("Transaction rejected by user.");
            } else {
                setErrorMessage("Payment failed. Check your balance.");
            }
            return false;
        }
    };

    const checkAccess = (courseId: string) => {
        return purchasedCourses.includes(courseId);
    };

    return (
        <PaymentContext.Provider value={{
            purchasedCourses,
            purchaseCourse,
            checkAccess,
            isWalletConnected,
            walletAddress,
            chainId,
            connectWallet,
            switchNetwork,
            paymentStatus,
            errorMessage
        }}>
            {children}
        </PaymentContext.Provider>
    );
}

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) throw new Error("usePayment must be used within a PaymentProvider");
    return context;
};
