import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BrowserProvider } from 'ethers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface User {
    id: string;
    walletAddress: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithWallet: () => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in via JWT
        fetch(`${API_URL}/api/auth/me`, {
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) {
                    setUser(data.user);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const loginWithWallet = async () => {
        setError(null);

        if (!window.ethereum) {
            setError("MetaMask is not installed!");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const walletAddress = accounts[0];
            const signer = await provider.getSigner();

            // Sign a message to prove ownership
            const message = "Login to AI Educate Portal";
            const signature = await signer.signMessage(message);

            // Send to backend for verification
            const res = await fetch(`${API_URL}/api/auth/login/wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ walletAddress, signature })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }

            const data = await res.json();
            setUser(data.user);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithWallet, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
