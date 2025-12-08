import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { GraduationCap, LogOut, Lock, Play, Wallet } from 'lucide-react';

export default function PortalHome() {
    const { user, logout, loginWithWallet, error } = useAuth();
    const { checkAccess } = usePayment();

    const handleLogout = async () => {
        await logout();
    };

    const hasAccess = checkAccess('capitalist');

    return (
        <div className="min-h-screen bg-dark-900 font-sans text-gray-100">
            <header className="bg-dark-800 border-b border-dark-700">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-gold-500" />
                        <span className="font-bold text-lg tracking-wide">AI Educate Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-400 font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-white">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={loginWithWallet}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest text-xs"
                            >
                                <Wallet size={16} /> Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {!user ? (
                    <div className="text-center py-20">
                        <GraduationCap size={80} className="mx-auto mb-6 text-gold-500/40" />
                        <h2 className="text-3xl font-serif font-bold mb-4 text-gold-500">Welcome to AI Educate Portal</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Connect your wallet to access premium courses and start your learning journey.
                        </p>
                        <button
                            onClick={loginWithWallet}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest text-sm"
                        >
                            <Wallet size={20} /> Connect Wallet to Continue
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-serif font-bold mb-8 text-gold-500">Available Courses</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Course Card */}
                            <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden group hover:border-gold-500/50 transition-all">
                                <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center relative">
                                    <GraduationCap size={64} className="text-gold-500/20 group-hover:text-gold-500/40 transition-all" />
                                    {hasAccess ? (
                                        <div className="absolute top-4 right-4 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                            Purchased
                                        </div>
                                    ) : (
                                        <div className="absolute top-4 right-4 bg-gold-500 text-dark-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            $2.00
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gold-400 transition-colors">Capitalist Thinking</h3>
                                    <p className="text-gray-400 mb-6 text-sm line-clamp-2">
                                        Master the mindset shift from laborer to capitalist. Complete 5 sessions to unlock your potential.
                                    </p>

                                    {hasAccess ? (
                                        <Link to="/course/capitalist" className="block w-full text-center py-3 bg-dark-700 hover:bg-dark-600 rounded text-gold-400 font-bold transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                            <Play size={16} /> Enter Course
                                        </Link>
                                    ) : (
                                        <Link to="/payment/capitalist" className="block w-full text-center py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                            <Lock size={16} /> Unlock Access
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Placeholder for future courses */}
                            <div className="bg-dark-800/50 rounded-lg border border-dark-700 border-dashed flex flex-col items-center justify-center p-12 text-gray-500">
                                <span className="text-sm uppercase tracking-widest mb-2">Coming Soon</span>
                                <p>More courses in development</p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
