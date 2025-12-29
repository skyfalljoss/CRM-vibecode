-- GlaceCRM Supabase Schema

-- 1. Create Tables

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    default_currency TEXT DEFAULT 'USD',
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipelines
CREATE TABLE IF NOT EXISTS pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stages (Pipeline stages)
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    position INT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    value NUMERIC(12, 2) DEFAULT 0,
    probability INT DEFAULT 0,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'created', 'updated', 'moved_stage', 'won', 'lost', etc.
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies

-- Workspace Policy: Users can only see/edit workspaces they belong to (simplified: owner access for v1)
CREATE POLICY "Users can view their own workspaces" ON workspaces
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own workspaces" ON workspaces
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own workspaces" ON workspaces
    FOR UPDATE USING (auth.uid() = owner_id);

-- Pipelines Policy: Access via workspace ownership
CREATE POLICY "Users can access pipelines in their workspaces" ON pipelines
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = pipelines.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Stages Policy: Access via pipeline -> workspace ownership
CREATE POLICY "Users can access stages in their pipelines" ON stages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pipelines
            JOIN workspaces ON pipelines.workspace_id = workspaces.id
            WHERE stages.pipeline_id = pipelines.id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Leads Policy: Users can only see leads in their own workspace
CREATE POLICY "Users can access leads in their workspaces" ON leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = leads.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Activities Policy: Users can only see activities in their own workspace
CREATE POLICY "Users can access activities in their workspaces" ON activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = activities.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Workspaces trigger
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- NEW PRD TABLES --

-- 5. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'canceled')) DEFAULT 'open',
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. Saved Lists
CREATE TABLE IF NOT EXISTS saved_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('static', 'dynamic')) DEFAULT 'static',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_saved_lists_updated_at BEFORE UPDATE ON saved_lists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Saved List Leads (Link Table)
CREATE TABLE IF NOT EXISTS saved_list_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saved_list_id UUID REFERENCES saved_lists(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(saved_list_id, lead_id)
);

-- Modify Leads Table (Add deleted_at for Soft Delete)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS position INT DEFAULT 0; -- For kanban ordering if needed later

-- Additional RLS Policies

-- Tasks Policy
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access tasks in their workspaces" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = tasks.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Saved Lists Policy
ALTER TABLE saved_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access saved_lists in their workspaces" ON saved_lists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = saved_lists.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Saved List Leads Policy
ALTER TABLE saved_list_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access saved_list_leads in their workspaces" ON saved_list_leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM saved_lists
            JOIN workspaces ON saved_lists.workspace_id = workspaces.id
            WHERE saved_list_leads.saved_list_id = saved_lists.id
            AND workspaces.owner_id = auth.uid()
        )
    );

