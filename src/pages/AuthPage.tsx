import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

// @ts-ignore
import { useAuth } from '../context/AuthContext';
export default function AuthPage() {
    const { session } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (session) {
            navigate('/dashboard', { replace: true });
        }
    }, [session, navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;

                // Workspace creation is now handled by the Onboarding flow in CRMApp
                // This avoids RLS issues if email confirmation is required (no session yet)

                alert('Account created! Please check your email for confirmation or sign in.');
                navigate('/auth?mode=login');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] overflow-hidden">
            <Navbar transparent={false} />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '64px 64px'
                    }}
                />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="min-h-screen flex items-center justify-center p-4 pt-24">
                <div className="glass-card w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Decorative blur */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-center mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-400 text-center mb-8 text-sm">
                            {mode === 'login'
                                ? 'Enter your credentials to access your workspace'
                                : 'Start organizing your leads in minutes'}
                        </p>

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            {mode === 'login' ? (
                                <>
                                    New here?{' '}
                                    <button onClick={() => navigate('/auth?mode=signup')} className="text-blue-400 hover:text-blue-300 font-medium">
                                        Create an account
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button onClick={() => navigate('/auth?mode=login')} className="text-blue-400 hover:text-blue-300 font-medium">
                                        Log in
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
