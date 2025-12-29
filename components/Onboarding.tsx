
import React, { useState } from 'react';
import { ArrowRight, Check, Rocket, Zap, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: (workspaceName: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [wsName, setWsName] = useState('');

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(wsName || 'My Workspace');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-[#09090b]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl glass-panel border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative">
        {/* Stepper */}
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 
              ${step === i ? 'w-10 bg-blue-500' : step > i ? 'w-6 bg-emerald-500/50' : 'w-6 bg-white/5'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
              <Rocket size={32} />
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">Welcome to SkyCRM</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The quiet, minimalist workspace for small teams to manage relationships, pipelines, and growth with clarity.
            </p>
            <div className="space-y-2 pt-4">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Workspace Name</label>
              <input
                type="text"
                placeholder="e.g. Glace Labs"
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
              <Zap size={32} />
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">Set Your Stages</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We've created a default pipeline for you. You can customize these stages later to match your sales process.
            </p>
            <div className="space-y-2 pt-4">
              {['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Won'].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                  <span className="text-sm text-zinc-300 font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
              <Users size={32} />
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">Ready to Go?</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              You're all set to start managing your pipeline. We've added some sample data to help you explore.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Check size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">Environment Ready</p>
                <p className="text-xs text-emerald-500/60">Sample database initialized successfully.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <button
            onClick={nextStep}
            className="flex items-center gap-2 bg-white text-zinc-950 px-8 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all shadow-2xl shadow-white/5 group"
          >
            <span>{step === 3 ? 'Launch CRM' : 'Continue'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={async () => {
              const { supabase } = await import('../src/lib/supabase');
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
