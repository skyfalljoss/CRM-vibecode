
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  Cell
} from 'recharts';
import { TrendingUp, Users, Award, Target, Zap, Clock } from 'lucide-react';
import { Lead, Stage, Activity } from '../types';

interface DashboardProps {
  leads: Lead[];
  stages: Stage[];
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads, stages, activities }) => {
  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.stageId !== '6' && l.stageId !== '7').length;
    const wonLeads = leads.filter(l => l.stageId === '6').length;
    const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
    const winRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    
    return [
      { label: 'Total Leads', value: totalLeads, icon: <Users size={16} />, color: 'blue' },
      { label: 'Active Deals', value: activeLeads, icon: <Target size={16} />, color: 'indigo' },
      { label: 'Won Projects', value: wonLeads, icon: <Award size={16} />, color: 'emerald' },
      { label: 'Pipeline Value', value: `$${(totalValue / 1000).toFixed(1)}k`, icon: <TrendingUp size={16} />, color: 'amber' },
    ];
  }, [leads]);

  const pipelineData = useMemo(() => {
    return stages.map(stage => ({
      name: stage.name,
      value: leads.filter(l => l.stageId === stage.id).length,
      amount: leads.filter(l => l.stageId === stage.id).reduce((sum, l) => sum + l.value, 0),
      color: stage.color
    }));
  }, [leads, stages]);

  const activityData = useMemo(() => {
    // Generate simple dummy data for activity over last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      name: day,
      actions: Math.floor(Math.random() * 20) + 5,
    }));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Workspace Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Here's what's happening with your sales pipeline today.</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-300">Daily Goal: 8/10 Actions</span>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500/50 w-[80%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
               {kpi.icon}
             </div>
             <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">{kpi.label}</p>
             <h3 className="text-3xl font-light text-white">{kpi.value}</h3>
             <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-400">
                <TrendingUp size={12} />
                <span>+12.5% from last month</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              Pipeline Velocity
            </h3>
            <select className="bg-white/5 border-none text-[10px] rounded-md outline-none px-2 py-1 text-zinc-400">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="actions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-medium text-zinc-300 mb-8 flex items-center gap-2">
            <Clock size={14} className="text-blue-400" />
            Lead Distribution
          </h3>
          <div className="flex-1 space-y-4">
            {pipelineData.slice(0, 5).map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">{d.name}</span>
                  <span className="text-white font-medium">{d.value}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full opacity-60" 
                    style={{ 
                      width: `${(d.value / leads.length) * 100}%`,
                      backgroundColor: d.color
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
         <h3 className="text-sm font-medium text-zinc-300 mb-6">Recent Activity</h3>
         <div className="space-y-4">
           {activities.length === 0 ? (
             <p className="text-zinc-500 text-xs italic">No recent activity detected.</p>
           ) : (
             activities.slice(0, 5).map((act, i) => (
               <div key={i} className="flex items-start gap-4 text-xs border-b border-white/5 pb-4 last:border-0 last:pb-0">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    {act.type === 'won' ? <Award size={14} className="text-emerald-400" /> : <TrendingUp size={14} className="text-blue-400" />}
                 </div>
                 <div className="flex-1">
                   <p className="text-zinc-300">{act.description}</p>
                   <p className="text-zinc-500 text-[10px] mt-0.5">{new Date(act.createdAt).toLocaleTimeString()}</p>
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
