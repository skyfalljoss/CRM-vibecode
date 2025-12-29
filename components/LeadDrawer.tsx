
import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building2, Calendar, DollarSign, Target, Plus, Trash2, Save, Send } from 'lucide-react';
import { Lead } from '../types';

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadDrawer: React.FC<LeadDrawerProps> = ({ lead, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes' | 'tasks'>('overview');
  const [editedLead, setEditedLead] = useState<Lead | null>(null);

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  if (!lead) return null;

  const handleSave = () => {
    if (editedLead) {
      onUpdate(editedLead);
      onClose();
    }
  };

  const handleChange = (field: keyof Lead, value: any) => {
    if (editedLead) {
      setEditedLead({ ...editedLead, [field]: value });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg glass-panel z-50 shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-blue-500/20">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">{lead.name}</h2>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Building2 size={12} />
                {lead.company}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>

        <nav className="flex px-6 border-b border-white/5">
          {['overview', 'activity', 'tasks', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-4 text-xs font-medium uppercase tracking-widest relative transition-colors
                ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">Core Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Full Name</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <input
                        className="bg-transparent border-none text-sm font-medium text-white w-full outline-none"
                        value={editedLead?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Company</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <Building2 size={14} className="text-zinc-500" />
                      <input
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none"
                        value={editedLead?.company || ''}
                        onChange={(e) => handleChange('company', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Source</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <select
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none appearance-none"
                        value={editedLead?.source || 'Website'}
                        onChange={(e) => handleChange('source', e.target.value)}
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
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Email Address</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <Mail size={14} className="text-zinc-500" />
                      <input
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none"
                        value={editedLead?.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Phone Number</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <Phone size={14} className="text-zinc-500" />
                      <input
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none"
                        value={editedLead?.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">Deal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Deal Value</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <DollarSign size={14} className="text-zinc-500" />
                      <input
                        type="number"
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none"
                        value={editedLead?.value || 0}
                        onChange={(e) => handleChange('value', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-600">Probability (%)</label>
                    <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <Target size={14} className="text-zinc-500" />
                      <input
                        type="number"
                        className="bg-transparent border-none text-xs text-zinc-300 w-full outline-none"
                        value={editedLead?.probability || 0}
                        onChange={(e) => handleChange('probability', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">Metadata</h3>
                <div className="bg-white/[0.02] p-4 rounded-xl space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Created At</span>
                    <span className="text-zinc-300">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Last Updated</span>
                    <span className="text-zinc-300">{lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Owner</span>
                    <span className="text-zinc-300">Alex Rivera</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <p className="text-xs text-zinc-300">Moved to <strong>Qualified</strong> stage</p>
                  <p className="text-[10px] text-zinc-500 mt-1">2 hours ago • by Alex Rivera</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <button
                // TODO: Trigger global task modal with lead pre-selected
                className="w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Add Linked Task
              </button>

              {/* Placeholder for tasks list linked to this lead */}
              <div className="text-center py-8 text-zinc-500 text-xs">
                No tasks linked to this lead yet.
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4 h-full flex flex-col">
              <textarea
                placeholder="Type a new note..."
                className="flex-1 w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500/50 resize-none placeholder:text-zinc-600"
              />
              <button className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-medium rounded-lg transition-all text-zinc-300 border border-white/5">
                <Send size={14} />
                <span>Save Note</span>
              </button>
            </div>
          )}
        </div>

        <footer className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this lead?')) {
                onDelete(lead.id);
                onClose();
              }
            }}
            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-xs font-bold hover:bg-white transition-all shadow-xl shadow-white/5 flex items-center gap-2">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LeadDrawer;
