export type StageId = string;

export interface Stage {
  id: StageId;
  name: string;
  position: number;
  color: string;
  pipeline_id: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  owner_id: string;
  stage_id: StageId;
  source: string;
  value: number;
  probability: number;
  created_at: string;
  updated_at: string;
  workspace_id: string;
  archived_at?: string;
  deleted_at?: string | null;
  tags?: string[];
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'canceled';

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: Priority;
  status: TaskStatus;
  lead_id?: string | null;
  owner_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface SavedList {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
  created_at: string;
  updated_at: string;
  lead_count?: number; // Optional helper for UI
}

export interface Activity {
  id: string;
  user_id: string;
  lead_id?: string;
  workspace_id: string;
  type: 'created' | 'updated' | 'moved_stage' | 'won' | 'lost' | 'imported' | 'task_created' | 'task_completed';
  description: string;
  created_at: string;
  metadata?: any;
}

export interface Workspace {
  id: string;
  name: string;
  logo_url?: string;
  owner_id: string;
  default_currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
}

export type ViewType = 'dashboard' | 'pipeline' | 'leads' | 'billing' | 'settings' | 'onboarding' | 'tasks';

