
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, Search, Bell, ChevronLeft, ChevronRight, Menu, 
  LayoutDashboard, Kanban, Users, CreditCard, Settings as SettingsIcon,
  X, Check, LogOut, Loader2
} from 'lucide-react';
import { STAGES, MOCK_LEADS, NAV_ITEMS, ICON_SIZE } from './constants';
import { ViewType, Lead, Stage, Activity, User, Workspace } from './types';
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import LeadsList from './components/LeadsList';
import Billing from './components/Billing';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import LeadDrawer from './components/LeadDrawer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('onboarding');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [stages, setStages] = useState<Stage[]>(STAGES);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user] = useState<User>({
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@glace.crm',
    avatarUrl: 'https://picsum.photos/seed/alex/100/100',
    role: 'admin'
  });
  const [workspace, setWorkspace] = useState<Workspace>({
    id: 'w1',
    name: 'Glace Labs',
    currency: 'USD'
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);

  // Derived state
  const selectedLead = useMemo(() => 
    leads.find(l => l.id === selectedLeadId) || null
  , [leads, selectedLeadId]);

  const addActivity = useCallback((type: Activity['type'], description: string, leadId?: string) => {
    const newActivity: Activity = {
      id: uuidv4(),
      userId: user.id,
      leadId,
      type,
      description,
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [user.id]);

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    addActivity('updated', `Updated lead: ${updatedLead.name}`, updatedLead.id);
  }, [addActivity]);

  const moveLead = useCallback((leadId: string, newStageId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const newLeads = leads.map(l => 
      l.id === leadId ? { ...l, stageId: newStageId, updatedAt: new Date().toISOString() } : l
    );
    setLeads(newLeads);
    
    const stageName = stages.find(s => s.id === newStageId)?.name || 'New Stage';
    addActivity('moved_stage', `Moved ${lead.name} to ${stageName}`, leadId);

    if (newStageId === '6') { // Won
      triggerWonCelebration();
    }
  }, [leads, stages, addActivity]);

  const deleteLead = useCallback((leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (lead) {
      setNotifications(prev => [...prev, `Lead "${lead.name}" deleted. Click to undo.`]);
      // Auto dismiss notification
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => !n.includes(lead.name)));
      }, 5000);
    }
  }, [leads]);

  const triggerWonCelebration = () => {
    // Basic confetti implementation or pulse logic
    const celebrationEl = document.createElement('div');
    celebrationEl.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    celebrationEl.innerHTML = `
      <div class="animate-ping bg-green-500/20 w-32 h-32 rounded-full flex items-center justify-center">
        <div class="bg-green-500 rounded-full p-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
        </div>
      </div>
    `;
    document.body.appendChild(celebrationEl);
    setTimeout(() => celebrationEl.remove(), 2000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard leads={leads} stages={stages} activities={activities} />;
      case 'pipeline': return <Pipeline leads={leads} stages={stages} onMoveLead={moveLead} onSelectLead={setSelectedLeadId} />;
      case 'leads': return <LeadsList leads={leads} stages={stages} onSelectLead={setSelectedLeadId} onDeleteLead={deleteLead} />;
      case 'billing': return <Billing workspace={workspace} />;
      case 'settings': return <Settings user={user} workspace={workspace} />;
      case 'onboarding': return <Onboarding onComplete={(wsName) => {
        setWorkspace(prev => ({ ...prev, name: wsName }));
        setCurrentView('dashboard');
      }} />;
      default: return <Dashboard leads={leads} stages={stages} activities={activities} />;
    }
  };

  if (currentView === 'onboarding') {
    return <Onboarding onComplete={(wsName) => {
      setWorkspace(prev => ({ ...prev, name: wsName }));
      setCurrentView('dashboard');
    }} />;
  }

  return (
    <div className="flex h-screen overflow-hidden text-zinc-100 selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside 
        className={`glass-panel border-r border-white/5 transition-all duration-300 flex flex-col z-40 
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
            G
          </div>
          {!isSidebarCollapsed && (
            <span className="font-semibold text-zinc-100 tracking-tight text-lg">GlaceCRM</span>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group
                ${currentView === item.id 
                  ? 'bg-white/5 text-white shadow-inner' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'}`}
            >
              {currentView === item.id && (
                <div className="absolute left-0 w-0.5 h-4 bg-blue-500 rounded-full" />
              )}
              <span className={`${currentView === item.id ? 'text-blue-400' : 'group-hover:text-zinc-300'}`}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
             <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
             {!isSidebarCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-medium truncate">{user.name}</p>
                 <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">{workspace.name}</p>
               </div>
             )}
          </div>
          {!isSidebarCollapsed && (
            <button className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-red-400 transition-colors mt-2 px-1">
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-30 glass-panel">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400"
            >
              <Menu size={ICON_SIZE} />
            </button>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <h2 className="text-sm font-medium text-zinc-300 capitalize">{currentView}</h2>
          </div>

          <div className="flex-1 max-w-xl mx-8 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search leads, tasks, or docs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400 relative">
              <Bell size={ICON_SIZE} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-zinc-950" />
            </button>
            <button 
              onClick={() => {
                setSelectedLeadId(null);
                setCurrentView('leads');
                // Could open a "New Lead" modal here
              }}
              className="flex items-center gap-2 bg-zinc-100 text-zinc-950 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-white transition-colors shadow-lg shadow-white/5"
            >
              <Plus size={16} strokeWidth={3} />
              <span>New Lead</span>
            </button>
          </div>
        </header>

        {/* View content */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth p-6">
          {renderView()}
        </div>

        {/* Toasts / Notifications */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
          {notifications.map((n, i) => (
            <div key={i} className="glass-card px-4 py-3 rounded-lg shadow-2xl border-white/10 flex items-center gap-3 animate-in slide-in-from-right-full">
              <Check className="text-blue-400" size={16} />
              <span className="text-sm">{n}</span>
              <button onClick={() => setNotifications([])} className="ml-4 text-zinc-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Drawer */}
      <LeadDrawer 
        lead={selectedLead} 
        onClose={() => setSelectedLeadId(null)} 
        onUpdate={updateLead}
        onDelete={deleteLead}
      />
    </div>
  );
};

export default App;
