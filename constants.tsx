
import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  CreditCard, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  ArrowRight,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Trash2,
  FileUp,
  Download
} from 'lucide-react';

export const ICON_SIZE = 18;
export const ICON_SIZE_SMALL = 14;

export const STAGES = [
  { id: '1', name: 'Lead', position: 0, color: '#94a3b8' },
  { id: '2', name: 'Contacted', position: 1, color: '#60a5fa' },
  { id: '3', name: 'Qualified', position: 2, color: '#818cf8' },
  { id: '4', name: 'Proposal', position: 3, color: '#c084fc' },
  { id: '5', name: 'Negotiation', position: 4, color: '#fb923c' },
  { id: '6', name: 'Won', position: 5, color: '#4ade80' },
  { id: '7', name: 'Lost', position: 6, color: '#f87171' }
];

export const MOCK_LEADS = [
  {
    id: 'l1',
    name: 'Sarah Jenkins',
    company: 'Acme Corp',
    email: 'sarah@acme.com',
    phone: '+1 555-0101',
    ownerId: 'u1',
    stageId: '1',
    source: 'Referral',
    value: 12000,
    probability: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['SaaS', 'High Priority']
  },
  {
    id: 'l2',
    name: 'Michael Chen',
    company: 'Starlight Tech',
    email: 'mchen@starlight.io',
    phone: '+1 555-0202',
    ownerId: 'u1',
    stageId: '3',
    source: 'LinkedIn',
    value: 45000,
    probability: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Enterprise']
  },
  {
    id: 'l3',
    name: 'Emma Watson',
    company: 'EcoStyle',
    email: 'emma@ecostyle.com',
    phone: '+1 555-0303',
    ownerId: 'u1',
    stageId: '6',
    source: 'Website',
    value: 8500,
    probability: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Retail']
  },
  {
    id: 'l4',
    name: 'David Miller',
    company: 'BuildRight',
    email: 'david@buildright.com',
    phone: '+1 555-0404',
    ownerId: 'u1',
    stageId: '2',
    source: 'Conference',
    value: 25000,
    probability: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Construction']
  },
  {
    id: 'l5',
    name: 'Jessica Lee',
    company: 'CloudNine',
    email: 'jess@cloudnine.io',
    phone: '+1 555-0505',
    ownerId: 'u1',
    stageId: '4',
    source: 'Google Ads',
    value: 62000,
    probability: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Cloud', 'Hot']
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Kanban size={ICON_SIZE} /> },
  { id: 'leads', label: 'Leads', icon: <Users size={ICON_SIZE} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={ICON_SIZE} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={ICON_SIZE} /> },
];
