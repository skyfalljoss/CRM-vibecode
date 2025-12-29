
import React, { useState } from 'react';
import { Lead, Stage } from '../types';
import { Filter, MoreHorizontal, Plus, Search, DollarSign } from 'lucide-react';

interface PipelineProps {
  leads: Lead[];
  stages: Stage[];
  onMoveLead: (leadId: string, newStageId: string) => void;
  onSelectLead: (leadId: string) => void;
  onAddDeal: (stageId: string) => void;
  searchQuery?: string;
}

const Pipeline: React.FC<PipelineProps> = ({ leads, stages, onMoveLead, onSelectLead, onAddDeal, searchQuery: globalSearch }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');

  const finalSearch = globalSearch || localSearch;

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !finalSearch || l.name.toLowerCase().includes(finalSearch.toLowerCase()) || l.company.toLowerCase().includes(finalSearch.toLowerCase());
    const matchesSource = sourceFilter === 'All Sources' || l.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    onMoveLead(leadId, stageId);
    setDraggedId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Sales Pipeline</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage deals across stages with drag and drop.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card flex items-center rounded-lg px-2 py-1">
            <Filter size={14} className="text-zinc-500 mr-2" />
            <select
              className="bg-transparent border-none text-[10px] outline-none text-zinc-300"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option className="bg-zinc-900">All Sources</option>
              <option className="bg-zinc-900">Referral</option>
              <option className="bg-zinc-900">Website</option>
              <option className="bg-zinc-900">LinkedIn</option>
              <option className="bg-zinc-900">Cold Call</option>
              <option className="bg-zinc-900">Conference</option>
              <option className="bg-zinc-900">Other</option>
            </select>
          </div>
          <div className="glass-card flex items-center rounded-lg px-2 py-1 gap-2">
            <Search size={14} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Filter pipeline..."
              className="bg-transparent border-none text-[10px] outline-none text-zinc-300 w-24 focus:w-32 transition-all placeholder:text-zinc-600"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scroll-smooth">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage_id === stage.id);
          const stageValue = stageLeads.reduce((sum, l) => sum + Number(l.value), 0);

          return (
            <div
              key={stage.id}
              className="flex-none w-72 flex flex-col space-y-3"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stage.name}</span>
                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-500">{stageLeads.length}</span>
                </div>
                <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>

              <div className="flex-1 glass-panel rounded-2xl p-2 flex flex-col gap-2 min-h-[300px]">
                <div className="px-2 py-1 flex justify-between items-center text-[10px] text-zinc-600 border-b border-white/5 mb-1 pb-2">
                  <span>Total Value</span>
                  <span className="text-zinc-400 font-medium">${stageValue.toLocaleString()}</span>
                </div>

                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, lead.id)}
                    onClick={() => onSelectLead(lead.id)}
                    className={`glass-card p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:border-white/20 group
                    ${draggedId === lead.id ? 'opacity-40 scale-95 grayscale' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{lead.name}</h4>
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src={`https://picsum.photos/seed/${lead.owner_id}/20/20`} alt="" />
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mb-3">{lead.company}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-zinc-300 font-medium">
                        <DollarSign size={10} className="text-zinc-500" />
                        <span className="text-xs">{(Number(lead.value) / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex gap-1">
                        {lead.tags?.slice(0, 1).map((tag, i) => (
                          <span key={i} className="text-[8px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-full text-zinc-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onAddDeal(stage.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[10px] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] rounded-lg transition-all border border-dashed border-white/5 mt-auto"
                >
                  <Plus size={12} />
                  <span>Add Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
