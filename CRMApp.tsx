import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Plus, Search, Bell, ChevronLeft, ChevronRight, Menu,
    LayoutDashboard, Kanban, Users, CreditCard, Settings as SettingsIcon,
    X, Check, LogOut, Loader2
} from 'lucide-react';
import { STAGES, MOCK_LEADS, NAV_ITEMS, ICON_SIZE } from './constants';
import { ViewType, Lead, Stage, Activity, User, Workspace, Task } from './types';
import { supabase } from './src/lib/supabase';
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import LeadsList from './components/LeadsList';
import TasksList from './components/TasksList';
import Billing from './components/Billing';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import LeadDrawer from './components/LeadDrawer';
import NewLeadModal from './components/NewLeadModal';
import TaskDrawer from './components/TaskDrawer';
// @ts-ignore
import { useAuth } from './src/context/AuthContext';

const CRMApp: React.FC = () => {
    const { signOut, user: authUser } = useAuth();
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const [user] = useState<User>({
        id: authUser?.id || 'u1',
        name: authUser?.user_metadata?.full_name || authUser?.email || 'User',
        email: authUser?.email || '',
        avatarUrl: authUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${authUser?.email}&background=random`,
        role: 'admin'
    });

    const [workspace, setWorkspace] = useState<Workspace | null>(null);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState<string[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [newLeadStageId, setNewLeadStageId] = useState<string | undefined>(undefined);

    // Tasks State
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);

    // Handlers for Tasks
    const handleOpenTaskDrawer = (task?: Partial<Task>) => {
        setSelectedTask(task || null);
        setIsTaskDrawerOpen(true);
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        if (!workspace || !authUser) return;

        // Add workspace/owner if new
        const payload = {
            ...taskData,
            workspace_id: taskData.workspace_id || workspace.id,
            owner_id: taskData.owner_id || authUser.id,
            updated_at: new Date().toISOString()
        };

        let result;
        if (taskData.id) {
            // Update
            result = await supabase.from('tasks').update(payload).eq('id', taskData.id).select().single();
        } else {
            // Create
            result = await supabase.from('tasks').insert([payload]).select().single();
            if (result.data) {
                logActivity('task_created', `Created task: ${result.data.title}`, result.data.lead_id);
            }
        }

        if (result.error) {
            console.error('Error saving task:', result.error);
        } else {
            // Refresh logic - ideally we just update local state if we had a global tasks list
            // For now, simpler to trigger a refetch or simple Toast
            setNotifications(prev => [...prev, taskData.id ? 'Task updated' : 'Task created']);
            setIsTaskDrawerOpen(false);
            // Optionally fetchTasks if we were passing a refresh trigger down.
            // For Global TasksList, it fetches on mount/update. 
            // We might want to trigger a refresh via context or prop, but let's rely on basic flow for now.
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (!error) {
            setNotifications(prev => [...prev, 'Task deleted']);
            setIsTaskDrawerOpen(false);
        }
    };

    const handleOpenNewLeadModal = (stageId?: string) => {
        setNewLeadStageId(stageId);
        setIsNewLeadModalOpen(true);
    };

    const fetchData = useCallback(async () => {
        if (!authUser) return;
        setLoading(true);
        try {
            // 1. Get Workspace
            const { data: wsData, error: wsError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('owner_id', authUser.id)
                .single();

            if (wsError) throw wsError;
            setWorkspace(wsData);

            // 2. Get Stages (via pipeline)
            const { data: pipeData } = await supabase
                .from('pipelines')
                .select('id')
                .eq('workspace_id', wsData.id)
                .single();

            if (pipeData) {
                const { data: stagesData } = await supabase
                    .from('stages')
                    .select('*')
                    .eq('pipeline_id', pipeData.id)
                    .order('position', { ascending: true });

                if (stagesData) setStages(stagesData);
            }

            // 3. Get Leads
            const { data: leadsData } = await supabase
                .from('leads')
                .select('*')
                .eq('workspace_id', wsData.id)
                .is('deleted_at', null); // Only fetch non-deleted leads

            if (leadsData) setLeads(leadsData);

            // 4. Get Activities
            const { data: activitiesData } = await supabase
                .from('activities')
                .select('*')
                .eq('workspace_id', wsData.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (activitiesData) setActivities(activitiesData);

        } catch (error) {
            console.error('Error fetching CRM data:', error);
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Redirect to pipeline view when searching
    useEffect(() => {
        if (searchQuery && currentView !== 'pipeline') {
            setCurrentView('pipeline');
        }
    }, [searchQuery, currentView]);

    const selectedLead = useMemo(() =>
        leads.find(l => l.id === selectedLeadId) || null
        , [leads, selectedLeadId]);

    const logActivity = useCallback(async (type: Activity['type'], description: string, leadId?: string) => {
        if (!workspace || !authUser) return;

        const newActivity = {
            workspace_id: workspace.id,
            user_id: authUser.id,
            lead_id: leadId,
            type,
            description,
        };

        const { data, error } = await supabase
            .from('activities')
            .insert([newActivity])
            .select()
            .single();

        if (data) setActivities(prev => [data, ...prev]);
    }, [workspace, authUser]);

    const updateLead = useCallback(async (updatedLead: Lead) => {
        const { error } = await supabase
            .from('leads')
            .update(updatedLead)
            .eq('id', updatedLead.id);

        if (!error) {
            setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
            logActivity('updated', `Updated lead: ${updatedLead.name}`, updatedLead.id);
        }
    }, [logActivity]);

    const moveLead = useCallback(async (leadId: string, newStageId: string) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        const { error } = await supabase
            .from('leads')
            .update({ stage_id: newStageId })
            .eq('id', leadId);

        if (!error) {
            setLeads(prev => prev.map(l =>
                l.id === leadId ? { ...l, stage_id: newStageId } : l
            ));

            const stageName = stages.find(s => s.id === newStageId)?.name || 'New Stage';
            logActivity('moved_stage', `Moved ${lead.name} to ${stageName}`, leadId);

            const wonStage = stages.find(s => s.name.toLowerCase() === 'won');
            if (wonStage && newStageId === wonStage.id) {
                triggerWonCelebration();
            }
        }
    }, [leads, stages, logActivity]);

    const deleteLead = useCallback(async (leadId: string) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        // Soft delete
        const { error } = await supabase
            .from('leads')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', leadId);

        if (!error) {
            setLeads(prev => prev.filter(l => l.id !== leadId));

            // Undo Toast
            const toastId = uuidv4(); // simplified ID
            // We need a complex toast system for "Undo", but for now we'll just notify
            setNotifications(prev => [...prev, `Lead "${lead.name}" moved to trash.`]);

            // TODO: Implement actual Undo action button in verification phase if time permits
        }
    }, [leads]);

    const createLead = useCallback(async (leadData: Partial<Lead>) => {
        if (!workspace || !authUser) return;

        const { data, error } = await supabase
            .from('leads')
            .insert([{
                ...leadData,
                workspace_id: workspace.id,
                owner_id: authUser.id,
                stage_id: leadData.stage_id || stages[0]?.id
            }])
            .select()
            .single();

        if (data) {
            setLeads(prev => [data, ...prev]);
            logActivity('created', `Created new lead: ${data.name}`, data.id);
            setSelectedLeadId(null);
        } else if (error) {
            console.error('Error creating lead:', error);
        }
    }, [workspace, authUser, stages, logActivity]);

    const importLeads = useCallback(async (leadsData: Partial<Lead>[]) => {
        if (!workspace || !authUser) return;

        const leadsToInsert = leadsData.map(l => ({
            ...l,
            workspace_id: workspace.id,
            owner_id: authUser.id,
            stage_id: stages[0]?.id // Default to first stage
        }));

        const { error } = await supabase.from('leads').insert(leadsToInsert);

        if (!error) {
            // Refetch or manual update (refetch is safer for bulk)
            fetchData();
            setNotifications(prev => [...prev, `Imported ${leadsData.length} leads successfully.`]);
        } else {
            console.error('Error importing leads:', error);
            setNotifications(prev => [...prev, `Failed to import leads.`]);
        }
    }, [workspace, authUser, stages, fetchData]);

    const triggerWonCelebration = () => {
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

    const createSavedList = async (name: string, leadIds: string[]) => {
        if (!workspace || !authUser) return;

        // 1. Create List
        const { data: listData, error: listError } = await supabase
            .from('saved_lists')
            .insert([{
                workspace_id: workspace.id,
                name,
                type: 'static',
                created_by: authUser.id
            }])
            .select()
            .single();

        if (listError) {
            console.error('Error creating list:', listError);
            setNotifications(prev => [...prev, 'Failed to create list']);
            return;
        }

        // 2. Add Leads to List
        if (leadIds.length > 0) {
            const listLeads = leadIds.map(leadId => ({
                saved_list_id: listData.id,
                lead_id: leadId
            }));

            const { error: itemsError } = await supabase
                .from('saved_list_leads')
                .insert(listLeads);

            if (itemsError) {
                console.error('Error adding leads to list:', itemsError);
                setNotifications(prev => [...prev, 'List created but failed to add leads']);
            } else {
                setNotifications(prev => [...prev, `List "${name}" created with ${leadIds.length} leads.`]);
            }
        }
    };

    const filteredLeads = useMemo(() => {
        if (!searchQuery) return leads;
        const q = searchQuery.toLowerCase();
        return leads.filter(l =>
            l.name.toLowerCase().includes(q) ||
            (l.company && l.company.toLowerCase().includes(q)) ||
            (l.email && l.email.toLowerCase().includes(q))
        );
    }, [leads, searchQuery]);

    const handleOnboardingComplete = async (workspaceName: string) => {
        if (!authUser) return;
        setLoading(true);

        try {
            // 1. Create Workspace
            const { data: ws, error: wsError } = await supabase
                .from('workspaces')
                .insert([{
                    owner_id: authUser.id,
                    name: workspaceName
                }])
                .select()
                .single();

            if (wsError) throw wsError;

            // 2. Create Pipeline
            const { data: pipeline, error: pipeError } = await supabase
                .from('pipelines')
                .insert([{
                    workspace_id: ws.id,
                    name: 'Sales Pipeline'
                }])
                .select()
                .single();

            if (pipeError) throw pipeError;

            // 3. Create Default Stages
            const stagesToInsert = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'].map((name, index) => ({
                pipeline_id: pipeline.id,
                name,
                position: index,
                color: ['#94a3b8', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'][index]
            }));

            const { error: stageError } = await supabase.from('stages').insert(stagesToInsert);
            if (stageError) throw stageError;

            // 4. Create Sample Leads (Optional)
            // ... skipping for now or can add later

            // Done - refresh data
            fetchData();

        } catch (error) {
            console.error('Error creating workspace:', error);
            // reset loading so user can try again? or show error
            setLoading(false);
            alert(`Failed to create workspace: ${(error as any).message || JSON.stringify(error)}`);
        }
    };

    const renderView = () => {
        if (loading) return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );

        switch (currentView) {
            case 'dashboard': return <Dashboard leads={filteredLeads} stages={stages} activities={activities} />;
            case 'pipeline': return <Pipeline leads={filteredLeads} stages={stages} onMoveLead={moveLead} onSelectLead={setSelectedLeadId} onAddDeal={handleOpenNewLeadModal} searchQuery={searchQuery} />;
            case 'leads': return <LeadsList leads={filteredLeads} stages={stages} onSelectLead={setSelectedLeadId} onDeleteLead={deleteLead} onImport={importLeads} onSaveList={createSavedList} />;
            case 'tasks': return <TasksList user={user} workspaceId={workspace!.id} onAddTask={() => handleOpenTaskDrawer()} onEditTask={handleOpenTaskDrawer} />;
            case 'billing': return <Billing workspace={workspace!} />;
            case 'settings': return <Settings user={user} workspace={workspace!} />;
            default: return <Dashboard leads={filteredLeads} stages={stages} activities={activities} />;
        }
    };

    // If no workspace found, show Onboarding to create one
    if (!workspace && !loading) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
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
                        <span className="font-semibold text-zinc-100 tracking-tight text-lg">SkyCRM</span>
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
                                <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">{workspace?.name}</p>
                            </div>
                        )}
                    </div>
                    {!isSidebarCollapsed && (
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-red-400 transition-colors mt-2 px-1"
                        >
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

                    <div className="flex items-center gap-3 relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 relative"
                        >
                            <Bell size={ICON_SIZE} />
                            {notifications.length > 0 && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-zinc-950" />
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-xs font-semibold text-zinc-300">Notifications</h3>
                                    <button onClick={() => setNotifications([])} className="text-[10px] text-blue-400 hover:text-blue-300">Clear all</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-zinc-500 text-xs">No new notifications</div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div key={i} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors text-xs text-zinc-300 flex gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                {n}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => handleOpenNewLeadModal()}
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

            {/* New Lead Modal */}
            <NewLeadModal
                isOpen={isNewLeadModalOpen}
                onClose={() => setIsNewLeadModalOpen(false)}
                onSubmit={createLead}
                stages={stages}
                defaultStageId={newLeadStageId}
            />

            {/* Task Drawer (Shared) */}
            <TaskDrawer
                isOpen={isTaskDrawerOpen}
                onClose={() => setIsTaskDrawerOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
                leads={leads}
                users={[]} // pass users if available
                currentUserId={user.id}
                defaultLeadId={selectedLead?.id}
            />
        </div>
    );
};

export default CRMApp;
