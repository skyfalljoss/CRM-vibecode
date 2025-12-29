import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, Zap, Target, BarChart3, CheckCircle2,
  Users, TrendingUp, Layers, ListTodo, Upload, Sparkles, ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();

  const logos = ['Stripe', 'Notion', 'Figma', 'Linear', 'Vercel'];

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Pipeline you want to look at',
      description: 'Kanban boards designed for clarity. Drag deals, not columns.'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Focus on what matters',
      description: 'Daily goals and smart task lists keep you closing, not organizing.'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Analytics without the noise',
      description: 'Beautiful charts that update in real-time. No configuration needed.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individuals exploring modern CRM.',
      features: ['Up to 100 leads', 'Basic pipeline', 'CSV exports', 'Single workspace'],
      cta: 'Start free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$24',
      description: 'For growing teams with serious pipelines.',
      features: ['Unlimited leads', 'Multi-pipelines', 'Advanced analytics', 'Priority support', 'API access'],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Agency',
      price: '$99',
      description: 'For businesses managing high volume.',
      features: ['Team permissions', 'White-labeling', 'Dedicated manager', 'Custom integrations'],
      cta: 'Contact sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-[60%] right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar transparent />

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Design-first CRM inspired by Attio & Linear</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
                See your entire pipeline in one{' '}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  glassy, fast
                </span>{' '}
                workspace.
              </h1>

              <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg">
                The CRM for founders who value speed and aesthetics. Manage leads, track deals, and close more
                sales—without the clunky spreadsheets.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="group px-7 py-3.5 bg-white text-zinc-900 rounded-full font-semibold text-sm hover:bg-zinc-100 transition-all shadow-xl shadow-white/10 flex items-center gap-2"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="group px-7 py-3.5 bg-white/[0.03] border border-white/10 rounded-full font-medium text-sm text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  Watch 60s tour
                </button>
              </div>
            </div>

            {/* Right: Product Preview */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Glass Card - Pipeline Preview */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-zinc-500">Pipeline — Sales Q4</span>
                  </div>
                  {/* Pipeline Columns */}
                  <div className="grid grid-cols-4 gap-3">
                    {['Lead', 'Qualified', 'Proposal', 'Won'].map((stage, i) => (
                      <div key={stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stage}</span>
                          <span className="text-[10px] text-zinc-600">{3 - i}</span>
                        </div>
                        {[...Array(3 - i)].map((_, j) => (
                          <div
                            key={j}
                            className={`bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5 ${i === 0 && j === 0 ? 'ring-2 ring-blue-500/50 animate-pulse' : ''
                              }`}
                          >
                            <div className="w-full h-2 bg-white/10 rounded mb-1.5" />
                            <div className="w-2/3 h-1.5 bg-white/5 rounded" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Analytics Card */}
                <div className="absolute -bottom-8 -left-8 w-48 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Pipeline Value</span>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="text-2xl font-light text-white">$124.5k</div>
                  <div className="text-[10px] text-green-400">+18.2% this month</div>
                </div>

                {/* Floating Task Card */}
                <div className="absolute -top-4 -right-4 w-44 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-xl p-3 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    <span className="text-xs text-zinc-300 truncate">Follow up with Acme</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Due today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SOCIAL PROOF ========== */}
      {/* <section className="py-16 border-y border-white/[0.03]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <div key={logo} className="text-zinc-600 font-semibold text-lg tracking-tight opacity-50 hover:opacity-80 transition-opacity">
                {logo}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">3k+</span>
              <span>deals tracked/week</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">99.9%</span>
              <span>uptime</span>
            </div>
          </div>
        </div>
      </section> */}

      {/* ========== WHY SKYCRM ========== */}
      <section id="product" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">Why SkyCRM</p>
            <h2 className="text-4xl font-medium tracking-tight mb-4">Built for how you actually work</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              No bloated dashboards. No endless configuration. Just the features you need to close more deals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PIPELINE SECTION (Dark Band) ========== */}
      <section id="pipeline" className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-[#09090b] border-y border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-3">Pipeline</p>
              <h2 className="text-4xl font-medium tracking-tight mb-4">Drag-and-drop pipelines, no clutter</h2>
              <p className="text-zinc-400 mb-8">
                Create stages that match your process. Move deals with a single drag. Watch your revenue grow.
              </p>
              <div className="space-y-4">
                {['Create custom stages in seconds', 'Drag deals between columns', 'Celebrate wins automatically'].map(
                  (step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <span className="text-zinc-300">{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-4">
                  {['Qualified', 'Proposal', 'Negotiation'].map((stage) => (
                    <div key={stage} className="space-y-3">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stage}</div>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 h-20" />
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 h-16 opacity-60" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LEAD IMPORTS ========== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-3 border-b border-white/[0.05]">
                  <div>Name</div>
                  <div>Company</div>
                  <div>Value</div>
                  <div>Status</div>
                </div>
                {/* Table Rows */}
                {[
                  { name: 'Sarah Chen', company: 'TechCorp', value: '$45k', status: 'Hot' },
                  { name: 'Mike Ross', company: 'Acme Inc', value: '$32k', status: 'Warm' },
                  { name: 'Lisa Park', company: 'StartupXY', value: '$28k', status: 'New' }
                ].map((lead, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-white/[0.03] text-sm">
                    <div className="text-zinc-200">{lead.name}</div>
                    <div className="text-zinc-400">{lead.company}</div>
                    <div className="text-green-400">{lead.value}</div>
                    <div>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs uppercase tracking-widest text-green-400 font-bold mb-3">Imports</p>
              <h2 className="text-4xl font-medium tracking-tight mb-4">From spreadsheet to pipeline in seconds</h2>
              <p className="text-zinc-400 mb-6">
                Upload your old CSV, map fields with smart suggestions, and start selling immediately.
              </p>
              <ul className="space-y-3">
                {['Upload from any spreadsheet format', 'Smart field mapping for any header', 'Duplicate detection built-in'].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TASKS SECTION ========== */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#09090b] to-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-3">Tasks</p>
          <h2 className="text-4xl font-medium tracking-tight mb-4">Everything you need to do, linked to leads that matter</h2>
          <p className="text-zinc-400 mb-12 max-w-xl mx-auto">
            Daily focus lists that keep you closing deals, not drowning in to-dos.
          </p>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 max-w-md mx-auto">
            {[
              { title: 'Follow up with Acme Inc', priority: 'high', done: true },
              { title: 'Send proposal to TechCorp', priority: 'medium', done: false },
              { title: 'Schedule demo with StartupXY', priority: 'low', done: false }
            ].map((task, i) => (
              <div key={i} className={`flex items-center gap-4 py-3 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${task.done ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
                    }`}
                >
                  {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`flex-1 text-left text-sm ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                  {task.title}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.priority === 'high'
                    ? 'bg-red-500/10 text-red-400'
                    : task.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-zinc-500/10 text-zinc-400'
                    }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ANALYTICS SECTION ========== */}
      <section id="analytics" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Analytics</p>
            <h2 className="text-4xl font-medium tracking-tight mb-4">Insights that actually drive action</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Real-time dashboards that update as you work. No exports, no spreadsheets, just clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Conversion Rate', value: '24%', change: '+5.2%', color: 'blue' },
              { label: 'Pipeline Value', value: '$248k', change: '+18%', color: 'green' },
              { label: 'Avg. Deal Size', value: '$12.4k', change: '+3.1%', color: 'purple' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">{stat.label}</div>
                <div className="text-3xl font-light text-white mb-2">{stat.value}</div>
                <div className={`text-sm ${stat.color === 'green' || stat.color === 'blue' ? 'text-green-400' : 'text-purple-400'}`}>
                  {stat.change} vs last month
                </div>
                {/* Simple chart placeholder */}
                <div className="mt-4 h-16 flex items-end gap-1">
                  {[40, 55, 45, 70, 60, 80, 75].map((h, j) => (
                    <div
                      key={j}
                      className={`flex-1 rounded-t ${stat.color === 'blue' ? 'bg-blue-500/30' : stat.color === 'green' ? 'bg-green-500/30' : 'bg-purple-500/30'
                        }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-[#09090b] border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">Pricing</p>
            <h2 className="text-4xl font-medium tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-400">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white/[0.02] border rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.03] scale-105 z-10' : 'border-white/[0.05]'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light">{plan.price}</span>
                    <span className="text-sm text-zinc-500">/month</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.popular
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                    : 'bg-white/[0.05] text-white hover:bg-white/10'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-medium tracking-tight mb-6">
            Ready to close more deals?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            Join thousands of teams using SkyCRM to build better pipelines.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="group px-8 py-4 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-100 transition-all shadow-xl shadow-white/10 flex items-center gap-2"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 px-6 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
              G
            </div>
            <span className="text-sm font-medium text-zinc-400">SkyCRM</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="text-xs text-zinc-600">© 2024 SkyCRM. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
