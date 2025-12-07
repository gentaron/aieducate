import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
    const { user, login, register, error } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLocalError(null);

        try {
            if (isRegistering) {
                await register(email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setLocalError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center font-sans p-4">
            <div className="max-w-md w-full p-8 bg-dark-800 rounded-lg shadow-2xl border border-dark-700">
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        <GraduationCap className="w-12 h-12 text-dark-900" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-100 font-serif mb-2 text-center">AI Educate Portal</h1>
                <p className="text-gray-400 mb-8 text-center">
                    {isRegistering ? 'Create your account' : 'Sign in to access courses'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded text-gray-100 focus:outline-none focus:border-gold-500 transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Lock size={16} className="inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded text-gray-100 focus:outline-none focus:border-gold-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {(localError || error) && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                            {localError || error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-900 font-bold rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            'Processing...'
                        ) : isRegistering ? (
                            <><UserPlus size={20} /> Create Account</>
                        ) : (
                            <><LogIn size={20} /> Sign In</>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setLocalError(null);
                        }}
                        className="text-gold-400 hover:text-gold-300 text-sm transition-colors"
                    >
                        {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}
