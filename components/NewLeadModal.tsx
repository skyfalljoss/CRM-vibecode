import React, { useState } from 'react';
import { X, User, Building2, Mail, Phone, Target, Save, Loader2 } from 'lucide-react';
import { Stage } from '../types';

interface NewLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    stages: Stage[];
    defaultStageId?: string;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onSubmit, stages, defaultStageId }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        value: 0,
        source: 'Website',
        stage_id: defaultStageId || stages[0]?.id || '',
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                value: 0,
                source: 'Website',
                stage_id: defaultStageId || stages[0]?.id || '',
            });
        }
    }, [isOpen, defaultStageId, stages]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">Add New Lead</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                            <input
                                required
                                type="text"
                                placeholder="e.g. Sarah Connor"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                value={formData.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Company</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                            <input
                                type="text"
                                placeholder="e.g. Cyberdyne Systems"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                value={formData.company}
                                onChange={e => handleChange('company', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                <input
                                    type="email"
                                    placeholder="sarah@corp.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={formData.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Value ($)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                value={formData.value}
                                onChange={e => handleChange('value', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Source</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer"
                                value={formData.source}
                                onChange={e => handleChange('source', e.target.value)}
                            >
                                <option className="bg-zinc-900" value="Website">Website</option>
                                <option className="bg-zinc-900" value="Referral">Referral</option>
                                <option className="bg-zinc-900" value="LinkedIn">LinkedIn</option>
                                <option className="bg-zinc-900" value="Cold Call">Cold Call</option>
                                <option className="bg-zinc-900" value="Conference">Conference</option>
                                <option className="bg-zinc-900" value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Initial Stage</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer"
                            value={formData.stage_id}
                            onChange={e => handleChange('stage_id', e.target.value)}
                        >
                            {stages.map(stage => (
                                <option key={stage.id} className="bg-zinc-900" value={stage.id}>
                                    {stage.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    <Save size={16} />
                                    <span>Create Lead</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewLeadModal;
