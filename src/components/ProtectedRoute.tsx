import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen flex items-center justify-center text-gold-500">Loading Auth...</div>;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
