import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const planName = searchParams.get('plan') || 'Pro';
    const price = searchParams.get('price') || '$24';

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate('/dashboard', {
                    state: { notification: `Successfully upgraded to ${planName} plan!` }
                });
            }, 2000);
        }, 1500);
    };

    if (success) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
                <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <CheckCircle2 size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-zinc-400">You have been upgraded to the {planName} plan.</p>
                    </div>
                    <div className="animate-pulse text-zinc-500 text-sm">
                        Redirecting to dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="glass-panel p-8 rounded-3xl space-y-8 h-fit">
                    <div>
                        <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6 transition-colors">
                            <ArrowLeft size={16} />
                            <span>Back</span>
                        </button>
                        <h1 className="text-3xl font-light text-white mb-2">Checkout</h1>
                        <p className="text-zinc-500 text-sm">Complete your upgrade securely.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-white">{planName} Plan</h3>
                                <p className="text-xs text-zinc-500">Monthly subscription</p>
                            </div>
                            <span className="text-xl font-light text-white">{price}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm px-2">
                            <span className="text-zinc-400">Subtotal</span>
                            <span className="text-zinc-200">{price}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm px-2">
                            <span className="text-zinc-400">Tax</span>
                            <span className="text-zinc-200">$0.00</span>
                        </div>
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex justify-between items-center px-2">
                            <span className="text-white font-medium">Total due</span>
                            <span className="text-2xl font-bold text-blue-400">{price}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                        <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                        <p>Payments are secure and encrypted. You can cancel anytime.</p>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <CreditCard size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-medium text-white">Card Details</h2>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Cardholder Name</label>
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                    maxLength={19}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Expiry</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value)}
                                    maxLength={5}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 text-center"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="123"
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                                        maxLength={3}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-8 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <span>Pay {price}</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
