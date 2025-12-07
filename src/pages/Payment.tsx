import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { Lock, Wallet, AlertTriangle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { POLYGON_CHAIN_ID_HEX } from '../config/web3';

export default function Payment() {
    const { courseId = 'capitalist' } = useParams();
    const {
        purchaseCourse,
        isWalletConnected,
        walletAddress,
        connectWallet,
        chainId,
        switchNetwork,
        paymentStatus,
        errorMessage
    } = usePayment();
    const navigate = useNavigate();

    const handlePurchase = async () => {
        const success = await purchaseCourse(courseId);
        if (success) {
            setTimeout(() => {
                navigate(`/course/${courseId}`);
            }, 2000);
        }
    };

    const isPolygon = chainId === POLYGON_CHAIN_ID_HEX;

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center font-sans p-4">
            <div className="max-w-md w-full bg-dark-800 rounded-lg shadow-2xl border border-dark-700 overflow-hidden">
                <div className="bg-dark-900 p-6 border-b border-dark-700 flex items-center gap-4">
                    <div className="p-3 bg-gold-500/10 rounded-full text-gold-500">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-100">Unlock Content</h2>
                        <p className="text-gray-400 text-sm">Crypto Payment Required</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-gray-300">
                        To access <span className="text-gold-500 font-bold">Capitalist Thinking</span>, please complete the payment.
                    </p>

                    <div className="flex justify-between items-center pb-4 border-b border-dark-700">
                        <span className="text-gray-400">Price</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-white">2.00 USDC</span>
                            <p className="text-xs text-purple-400">on Polygon (PoS)</p>
                        </div>
                    </div>

                    {/* Step 1: Connect Wallet */}
                    {!isWalletConnected ? (
                        <button
                            onClick={connectWallet}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded flex items-center justify-center gap-3 transition-colors"
                        >
                            <Wallet size={20} /> Connect MetaMask
                        </button>
                    ) : (
                        <div className="space-y-4">
                            {/* Connected Status */}
                            <div className="flex items-center justify-between p-3 bg-dark-900 rounded border border-dark-600 text-xs text-gray-400">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Connected</span>
                                <span className="font-mono">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                            </div>

                            {/* Step 2: Network Check */}
                            {!isPolygon ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm flex items-center gap-2">
                                        <AlertTriangle size={16} /> Incorrect Network
                                    </div>
                                    <button
                                        onClick={switchNetwork}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <RefreshCw size={18} /> Switch to Polygon
                                    </button>
                                </div>
                            ) : (
                                /* Step 3: Payment */
                                <div className="space-y-4">
                                    {errorMessage && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePurchase}
                                        disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                                        className={`w-full py-4 rounded font-bold text-dark-900 transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${paymentStatus === 'success'
                                                ? 'bg-green-500'
                                                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {paymentStatus === 'pending' ? (
                                            <>Processing Payment...</>
                                        ) : paymentStatus === 'success' ? (
                                            <><CheckCircle size={20} /> Success!</>
                                        ) : (
                                            <>Pay 2.00 USDC <ArrowRight size={18} /></>
                                        )}
                                    </button>

                                    {paymentStatus === 'pending' && (
                                        <p className="text-center text-xs text-gray-500 animate-pulse">
                                            Please confirm transaction in your wallet...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
