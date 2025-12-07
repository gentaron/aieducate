import type { ReactNode } from 'react';
import { GraduationCap, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

export default function CourseLayout({ children }: LayoutProps) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col font-sans text-gray-100">
            <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/course/capitalist" className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg text-dark-900 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-100 tracking-tight font-serif">CAPITALIST</h1>
                            <p className="text-[0.65rem] text-gold-500 uppercase tracking-widest text-right -mt-1">Thinking</p>
                        </div>
                    </Link>
                    <nav className="flex gap-4">
                        {/* We could add a link back to Portal Home here */}
                        <Link to="/" className="text-gray-400 hover:text-gold-400 text-sm font-medium transition-colors">
                            Portal Home
                        </Link>
                        <Link to="/course/capitalist" className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === '/course/capitalist' ? 'bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/30' : 'text-gray-400 hover:text-gold-400 hover:bg-dark-700'}`}>
                            <LayoutDashboard size={18} />
                            <span>Course Dashboard</span>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </main>
        </div>
    );
}
