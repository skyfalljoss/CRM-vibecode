import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
    transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isAuthPage = location.pathname === '/auth';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !transparent
                ? 'bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.05] py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        S
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">SkyCRM</span>
                </button>

                {/* Center Nav Links - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { label: 'Product', href: '#product' },
                        { label: 'Pipeline', href: '#pipeline' },
                        { label: 'Analytics', href: '#analytics' },
                        { label: 'Pricing', href: '#pricing' },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                if (location.pathname !== '/') {
                                    navigate('/');
                                    setTimeout(() => {
                                        const el = document.querySelector(item.href);
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                } else {
                                    const el = document.querySelector(item.href);
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="text-sm text-zinc-400 hover:text-white transition-colors font-medium bg-transparent border-none cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/auth?mode=login')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${isAuthPage && location.search.includes('login')
                            ? 'text-blue-400'
                            : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/auth?mode=signup')}
                        className="px-5 py-2 bg-white text-zinc-900 rounded-full text-sm font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/10"
                    >
                        Get started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
