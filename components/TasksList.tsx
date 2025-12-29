
import React, { useState, useEffect } from 'react';
import { Task, Lead, User, Priority, TaskStatus } from '../types';
import { supabase } from '../src/lib/supabase';
import {
    CheckCircle2, Circle, Clock, AlertCircle,
    Filter, Search, Plus, Calendar, User as UserIcon,
    ChevronLeft, ChevronRight
} from 'lucide-react';

interface TasksListProps {
    user: User;
    workspaceId: string;
    onAddTask: () => void;
    onEditTask: (task: Task) => void;
}

const TasksList: React.FC<TasksListProps> = ({ user, workspaceId, onAddTask, onEditTask }) => {
    const [tasks, setTasks] = useState<any[]>([]); // Using any[] to accommodate join data without strictly updating types.ts immediately
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('open');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const TASKS_PER_PAGE = 8;
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [workspaceId, filterStatus, page]);

    const fetchTasks = async () => {
        setLoading(true);
        const from = page * TASKS_PER_PAGE;
        const to = from + TASKS_PER_PAGE; // Fetch one extra to check for "more"

        // select(*, leads(name, company))
        let query = supabase
            .from('tasks')
            .select('*, leads (name, company)')
            .eq('workspace_id', workspaceId)
            .order('due_date', { ascending: true })
            .range(from, to);

        if (filterStatus !== 'all') {
            if (filterStatus === 'open') {
                query = query.neq('status', 'completed').neq('status', 'canceled');
            } else {
                query = query.eq('status', filterStatus);
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            const fetchedTasks = data || [];
            if (fetchedTasks.length > TASKS_PER_PAGE) {
                setHasMore(true);
                setTasks(fetchedTasks.slice(0, TASKS_PER_PAGE));
            } else {
                setHasMore(false);
                setTasks(fetchedTasks);
            }
        }
        setLoading(false);
    };

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'open' : 'completed';
        const updates: Partial<Task> = {
            status: newStatus,
            updated_at: new Date().toISOString()
        };

        if (newStatus === 'completed') {
            updates.completed_at = new Date().toISOString();
        } else {
            updates.completed_at = undefined;
        }

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...updates } : t));

        const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', task.id);

        if (error) {
            console.error('Error updating task:', error);
            // Revert on error
            fetchTasks();
        }
    };

    const getPriorityColor = (p: Priority) => {
        switch (p) {
            case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'low': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
            default: return 'text-zinc-400';
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.leads?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light tracking-tight text-white">Tasks</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage your to-dos and follow-ups.</p>
                </div>
                <button
                    onClick={onAddTask}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={16} />
                    <span>New Task</span>
                </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <Search size={14} className="text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-zinc-300 w-48 placeholder:text-zinc-600"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-zinc-600">View:</span>
                            {(['open', 'completed', 'all'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setFilterStatus(status); setPage(0); }}
                                    className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors border ${filterStatus === status
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                        }`}
                                >
                                    {status === 'open' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0 || loading}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs text-zinc-500 font-medium">Page {page + 1}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hasMore || loading}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* List Header */}
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 grid grid-cols-12 gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-4">Task</div>
                    <div className="col-span-3">Related Lead</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-2">Priority</div>
                </div>

                {/* List */}
                <div className="divide-y divide-white/5 flex-1">
                    {loading ? (
                        <div className="p-8 text-center text-zinc-500 text-sm">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={24} className="text-zinc-600" />
                            </div>
                            <h3 className="text-white font-medium mb-1">No tasks found</h3>
                            <p className="text-zinc-500 text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div key={task.id} className="px-4 py-3 hover:bg-white/[0.02] grid grid-cols-12 gap-4 items-center group transition-colors">
                                {/* Status */}
                                <div className="col-span-1">
                                    <button
                                        onClick={() => toggleTaskStatus(task)}
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all
                                        ${task.status === 'completed'
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-zinc-600 group-hover:border-blue-500'}`}
                                    >
                                        {task.status === 'completed' && <CheckCircle2 size={10} className="text-white" />}
                                    </button>
                                </div>

                                {/* Title */}
                                <div className="col-span-4 min-w-0 pr-4" onClick={() => onEditTask(task)} role="button">
                                    <h4 className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-200'} hover:text-blue-400 transition-colors`}>
                                        {task.title}
                                    </h4>
                                    {task.description && <p className="text-xs text-zinc-500 truncate mt-0.5">{task.description}</p>}
                                </div>

                                {/* Related Lead */}
                                <div className="col-span-3 min-w-0 flex items-center gap-2">
                                    {task.leads ? (
                                        <>
                                            <div className="w-5 h-5 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {task.leads.name.charAt(0)}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs text-zinc-300 truncate">{task.leads.name}</p>
                                                {task.leads.company && <p className="text-[10px] text-zinc-500 truncate">{task.leads.company}</p>}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-zinc-600 text-xs italic">-</span>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div className="col-span-2">
                                    {task.due_date ? (
                                        <span className={`text-xs flex items-center gap-1.5 ${new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-zinc-400'
                                            }`}>
                                            <Calendar size={12} />
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                </div>

                                {/* Priority */}
                                <div className="col-span-2">
                                    {task.priority && (
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border inline-flex ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TasksList;
