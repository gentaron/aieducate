import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in
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

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
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

    const register = async (email: string, password: string) => {
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Registration failed');
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
        <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
