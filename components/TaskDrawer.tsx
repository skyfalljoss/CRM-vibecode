
import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, User as UserIcon, CheckCircle2, Save, Trash2 } from 'lucide-react';
import { Task, Priority, TaskStatus, Lead, User } from '../types';
import { supabase } from '../src/lib/supabase';

interface TaskDrawerProps {
    task: Partial<Task> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    onDelete?: (taskId: string) => void;
    leads: Lead[];
    users: User[]; // For assignment, though we might just mock or use current user for now
    currentUserId: string;
    defaultLeadId?: string;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({
    task, isOpen, onClose, onSave, onDelete, leads, users, currentUserId, defaultLeadId
}) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        status: 'open',
        priority: 'medium',
        owner_id: currentUserId,
        lead_id: defaultLeadId || undefined,
    });

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setFormData(task);
            } else {
                // Reset for new task
                setFormData({
                    title: '',
                    status: 'open',
                    priority: 'medium',
                    owner_id: currentUserId,
                    lead_id: defaultLeadId,
                    due_date: new Date().toISOString().split('T')[0] // Default to today
                });
            }
        }
    }, [isOpen, task, currentUserId, defaultLeadId]);

    if (!isOpen) return null;

    const handleChange = (field: keyof Task, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose(); // Parent handles refresh
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
                onClick={onClose}
            />
            <div className="fixed top-0 right-0 h-full w-full max-w-md glass-panel z-50 shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col">
                <header className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">{task?.id ? 'Edit Task' : 'New Task'}</h2>
                            <p className="text-xs text-zinc-500">Manage to-do details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Task Title</label>
                            <input
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g. Follow up with client"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-zinc-600"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Due Date</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="date"
                                        value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleChange('due_date', new Date(e.target.value).toISOString())}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Priority</label>
                                <div className="relative">
                                    <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => handleChange('priority', e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500/50 appearance-none"
                                    >
                                        <option className="bg-zinc-900" value="low">Low</option>
                                        <option className="bg-zinc-900" value="medium">Medium</option>
                                        <option className="bg-zinc-900" value="high">High</option>
                                        <option className="bg-zinc-900" value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Related Lead</label>
                            <div className="relative">
                                <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <select
                                    value={formData.lead_id || ''}
                                    onChange={(e) => handleChange('lead_id', e.target.value || null)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500/50 appearance-none"
                                >
                                    <option className="bg-zinc-900" value="">No Lead Linked</option>
                                    {leads.map(l => (
                                        <option key={l.id} className="bg-zinc-900" value={l.id}>{l.name} - {l.company}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Add details..."
                                rows={4}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500/50 resize-none placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>

                <footer className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    {task?.id && onDelete ? (
                        <button
                            onClick={() => {
                                if (confirm('Delete this task?')) {
                                    onDelete(task.id!);
                                    onClose();
                                }
                            }}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    ) : <div />}

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.title}
                            className="px-6 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-xs font-bold hover:bg-white transition-all shadow-xl shadow-white/5 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={14} />
                            Save Task
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default TaskDrawer;
