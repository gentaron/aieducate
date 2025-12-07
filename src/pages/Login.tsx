import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Login() {
    const { user, login } = useAuth();

    if (user) return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center font-sans">
            <div className="max-w-md w-full p-8 bg-dark-800 rounded-lg shadow-2xl border border-dark-700 text-center">
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        <GraduationCap className="w-12 h-12 text-dark-900" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-100 font-serif mb-2">AI Educate Portal</h1>
                <p className="text-gray-400 mb-8">Sign in to access premium course content.</p>

                <button
                    onClick={login}
                    className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-dark-900 font-bold rounded flex items-center justify-center gap-3 transition-colors"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
