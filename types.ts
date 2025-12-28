
export type StageId = string;

export interface Stage {
  id: StageId;
  name: string;
  position: number;
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  ownerId: string;
  stageId: StageId;
  source: string;
  value: number;
  probability: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Activity {
  id: string;
  userId: string;
  leadId?: string;
  type: 'created' | 'updated' | 'moved_stage' | 'won' | 'lost' | 'imported';
  description: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  logoUrl?: string;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
}

export type ViewType = 'dashboard' | 'pipeline' | 'leads' | 'billing' | 'settings' | 'onboarding';
