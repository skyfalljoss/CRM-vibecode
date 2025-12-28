
import React from 'react';
// Aliased User to UserType to avoid collision with the User icon from lucide-react
import { User as UserType, Workspace } from '../types';
import { User as UserIcon, Shield, Layout, Bell, Globe, Key, Database } from 'lucide-react';

interface SettingsProps {
  user: UserType;
  workspace: Workspace;
}

const Settings: React.FC<SettingsProps> = ({ user, workspace }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-white">System Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Configure your workspace and personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-1">
          {[
            // Used UserIcon to refer to the lucide icon component
            { label: 'Profile', icon: <UserIcon size={14} />, active: true },
            { label: 'Workspace', icon: <Layout size={14} /> },
            { label: 'Notifications', icon: <Bell size={14} /> },
            { label: 'Integrations', icon: <Database size={14} /> },
            { label: 'Security', icon: <Key size={14} /> },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${item.active ? 'bg-white/5 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-medium text-white pb-4 border-b border-white/5">Public Profile</h3>
            
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                 <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-3xl border border-white/10 group-hover:opacity-50 transition-opacity" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Globe size={20} className="text-white" />
                 </div>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-medium text-white">{user.name}</p>
                 <p className="text-xs text-zinc-500">Member since January 2024</p>
                 <button className="text-[10px] text-blue-400 hover:underline">Change avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  disabled
                  className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white rounded-lg transition-all border border-white/5">
                Update Profile
              </button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
             <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="text-sm font-medium text-white">Danger Zone</h3>
                <Shield size={14} className="text-red-500/50" />
             </div>
             <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">
               Once you delete your account or workspace, there is no going back. Please be certain.
             </p>
             <button className="mt-4 px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-medium rounded-lg transition-all">
                Delete Account
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
