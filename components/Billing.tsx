
import React from 'react';
import { Check, Zap, Rocket, Star } from 'lucide-react';
import { Workspace } from '../types';

interface BillingProps {
  workspace: Workspace;
}

const Billing: React.FC<BillingProps> = ({ workspace }) => {
  const [currentPlan, setCurrentPlan] = React.useState('Free');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring and side projects.',
      features: ['Up to 100 leads', 'Basic pipeline', 'CSV exports', 'Single workspace'],
      icon: <Star size={24} className="text-zinc-400" />,
      popular: false
    },
    {
      name: 'Pro',
      price: '$24',
      description: 'Ideal for growing teams and serious sales.',
      features: ['Unlimited leads', 'Multi-pipelines', 'Advanced analytics', 'Supabase integration', 'Priority support'],
      icon: <Zap size={24} className="text-blue-400" />,
      popular: true
    },
    {
      name: 'Agency',
      price: '$99',
      description: 'For businesses managing high volume.',
      features: ['Team permissions', 'White-labeling', 'API access', 'Dedicated manager'],
      icon: <Rocket size={24} className="text-indigo-400" />,
      popular: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light tracking-tight text-white">Choose Your Plan</h1>
        <p className="text-zinc-500 text-sm max-w-lg mx-auto">
          Start for free and scale as your pipeline grows. All plans include our signature glassy UI and lightning-fast experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan === plan.name;
          return (
            <div
              key={i}
              className={`glass-card p-8 rounded-3xl relative flex flex-col transition-all duration-500 hover:translate-y-[-4px]
                ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.03] scale-105 z-10' : 'hover:border-white/20'}
                ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}
                `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                  Most Popular
                </div>
              )}

              <div className="mb-6">{plan.icon}</div>
              <h3 className="text-xl font-medium text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-light text-white">{plan.price}</span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-8 leading-relaxed">{plan.description}</p>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-blue-400" />
                    </div>
                    <span className="text-[11px] text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (isCurrent) return;
                  window.location.href = `/payment?plan=${plan.name}&price=${encodeURIComponent(plan.price)}`;
                }}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all
                ${isCurrent
                    ? 'bg-white/5 text-zinc-500 cursor-default'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-white/5'}`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-lg font-medium text-white">Current Billing Cycle</h4>
          <p className="text-xs text-zinc-500">Your next renewal date is <strong className="text-zinc-300">February 15, 2024</strong>.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs text-zinc-400 hover:text-white transition-colors">Download Last Invoice</button>
          <div className="h-4 w-px bg-white/10" />
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Manage Payment Method</button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
