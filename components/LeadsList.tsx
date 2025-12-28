
import React, { useState } from 'react';
import { Lead, Stage } from '../types';
import { 
  Search, Filter, MoreHorizontal, Mail, Phone, Building2, 
  Trash2, FileUp, Download, ChevronDown
} from 'lucide-react';

interface LeadsListProps {
  leads: Lead[];
  stages: Stage[];
  onSelectLead: (leadId: string) => void;
  onDeleteLead: (leadId: string) => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, stages, onSelectLead, onDeleteLead }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Lead>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getStageColor = (id: string) => stages.find(s => s.id === id)?.color || '#ccc';
  const getStageName = (id: string) => stages.find(s => s.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Lead Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Detailed list of all leads and their current status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors glass-card px-3 py-1.5 rounded-lg">
            <FileUp size={14} />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors glass-card px-3 py-1.5 rounded-lg">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Search size={14} className="text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Filter table..." 
                  className="bg-transparent border-none outline-none text-xs text-zinc-300 w-48 placeholder:text-zinc-600"
                />
             </div>
             <button className="flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white transition-colors px-2 py-1.5">
                <Filter size={14} />
                <span>Filters</span>
             </button>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <span className="text-[10px] text-zinc-500 font-medium">{selectedIds.length} selected</span>
               <button className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-md">
                 <Trash2 size={12} />
                 <span>Delete Selected</span>
               </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold bg-white/[0.01]">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded bg-zinc-800 border-white/10" 
                    onChange={(e) => setSelectedIds(e.target.checked ? leads.map(l => l.id) : [])}
                  />
                </th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  onClick={() => onSelectLead(lead.id)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded bg-zinc-800 border-white/10"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                          {lead.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{lead.name}</p>
                         <p className="text-[10px] text-zinc-500">{lead.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ 
                        backgroundColor: `${getStageColor(lead.stageId)}20`,
                        color: getStageColor(lead.stageId),
                        border: `1px solid ${getStageColor(lead.stageId)}40`
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStageColor(lead.stageId) }} />
                      {getStageName(lead.stageId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400 font-light">
                    {lead.company}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500 italic">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-200">
                    ${lead.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                      <img src={`https://picsum.photos/seed/${lead.ownerId}/24/24`} alt="" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 hover:text-white transition-colors">
                     <button onClick={(e) => {
                       e.stopPropagation();
                       // Context menu logic
                     }}>
                       <MoreHorizontal size={14} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
           <p className="text-[10px] text-zinc-500">Showing {leads.length} leads</p>
           <div className="flex gap-2">
             <button className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-zinc-400 hover:text-white transition-colors disabled:opacity-30" disabled>Previous</button>
             <button className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-zinc-400 hover:text-white transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsList;
