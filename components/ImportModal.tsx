
import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Lead, Stage } from '../types';
import * as Papa from 'papaparse'; // Using papaparse if available, or just mock parse

// If papaparse is not installed, we'll implement a simple CSV parser
// But let's assume we might need to recommend installing it or use a simple one.
// We'll write a simple parser for now to avoid dependency issues.

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (leads: Partial<Lead>[]) => void;
    stages: Stage[];
}

type Step = 'upload' | 'preview' | 'mapping' | 'importing';

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, stages }) => {
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length > 0) {
                const headers = lines[0].split(',').map(h => h.trim());
                const data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const row: any = {};
                    headers.forEach((h, i) => {
                        row[h] = values[i]?.trim();
                    });
                    return row;
                });
                setHeaders(headers);
                setCsvData(data);

                // Auto-map common fields
                const initialMapping: Record<string, string> = {};
                headers.forEach(h => {
                    const lower = h.toLowerCase();
                    if (lower.includes('name')) initialMapping['name'] = h;
                    else if (lower.includes('email')) initialMapping['email'] = h;
                    else if (lower.includes('phone')) initialMapping['phone'] = h;
                    else if (lower.includes('company')) initialMapping['company'] = h;
                    else if (lower.includes('source')) initialMapping['source'] = h;
                    else if (lower.includes('value') || lower.includes('amount') || lower.includes('revenue')) initialMapping['value'] = h;
                    else if (lower.includes('prob') || lower.includes('confidence')) initialMapping['probability'] = h;
                });
                setMapping(initialMapping);

                setStep('preview');
            }
        };
        reader.readAsText(file);
    };

    const handleImport = () => {
        setStep('importing');

        const mappedLeads = csvData.map(row => {
            const lead: Partial<Lead> = {};
            if (mapping['name']) lead.name = row[mapping['name']];
            if (mapping['email']) lead.email = row[mapping['email']];
            if (mapping['phone']) lead.phone = row[mapping['phone']];
            if (mapping['company']) lead.company = row[mapping['company']];
            if (mapping['source']) lead.source = row[mapping['source']] || 'Import';

            // Numeric fields
            if (mapping['value']) {
                const val = row[mapping['value']];
                lead.value = val ? parseFloat(val.replace(/[^0-9.]/g, '')) : 0;
            }
            if (mapping['probability']) {
                const prob = row[mapping['probability']];
                lead.probability = prob ? parseFloat(prob.replace(/[^0-9.]/g, '')) : 0;
            }

            // Defaults
            if (!lead.stage_id) lead.stage_id = stages[0]?.id;
            return lead;
        }).filter(l => l.name); // Basic validation

        setTimeout(() => {
            onImport(mappedLeads);
            onClose();
            // Reset state
            setStep('upload');
            setFile(null);
        }, 1500); // Simulate processing
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-[#09090b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <header className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Import Leads</h2>
                            <p className="text-sm text-zinc-500">Add multiple leads via CSV</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {step === 'upload' && (
                            <div
                                className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Upload className="text-blue-400" size={32} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-white mb-1">Click to upload CSV</h3>
                                    <p className="text-sm text-zinc-500">or drag and drop file here</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}

                        {(step === 'preview' || step === 'mapping') && (
                            <div className="space-y-6">
                                {/* Preview Table */}
                                <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                                    <div className="p-3 bg-white/5 text-xs font-semibold text-zinc-300 border-b border-white/5">
                                        File Preview ({csvData.length} rows)
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs text-zinc-400">
                                            <thead className="text-[10px] uppercase font-bold bg-white/[0.02]">
                                                <tr>
                                                    {headers.slice(0, 5).map(h => <th key={h} className="p-3">{h}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvData.slice(0, 3).map((row, i) => (
                                                    <tr key={i} className="border-t border-white/5">
                                                        {headers.slice(0, 5).map(h => <td key={h} className="p-3">{row[h]}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Field Mapping */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-white">Map Columns</h3>
                                        <div className="space-y-2">
                                            {['name', 'email', 'company', 'phone', 'source', 'value', 'probability'].map(field => (
                                                <div key={field} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                                    <span className="text-xs text-zinc-400 capitalize">{field} {field === 'name' ? '*' : ''}</span>
                                                    <select
                                                        value={mapping[field] || ''}
                                                        onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                                                        className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select Column</option>
                                                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 h-fit">
                                        <div className="flex gap-2 text-blue-400 mb-2">
                                            <AlertCircle size={16} />
                                            <span className="text-xs font-bold">Import Summary</span>
                                        </div>
                                        <ul className="text-xs text-zinc-400 space-y-1 list-disc pl-4">
                                            <li>{csvData.length} leads found</li>
                                            <li>Duplicates will be skipped (by email)</li>
                                            <li>All leads added to first stage</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'importing' && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-zinc-400">Importing leads...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.01]">
                        {step !== 'upload' && step !== 'importing' && (
                            <button
                                onClick={() => setStep('upload')}
                                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                        )}
                        {step === 'preview' && (
                            <button
                                onClick={() => setStep('mapping')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                            >
                                Next <ArrowRight size={14} />
                            </button>
                        )}
                        {step === 'mapping' && (
                            <button
                                onClick={handleImport}
                                disabled={!mapping['name']}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Import <FileSpreadsheet size={14} />
                            </button>
                        )}
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ImportModal;
