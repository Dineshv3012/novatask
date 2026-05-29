import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Users, UserPlus, Shield, BadgeAlert, Plus, Sparkles, Mail, UserCheck } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Developer' | 'Viewer' | 'Auditor';
  status: 'active' | 'synced' | 'pending';
}

export const TeamCollaborationPage = () => {
  const { theme } = useWorkspace();
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alpha Operator', email: 'alpha@novatask.ai', role: 'Administrator', status: 'active' },
    { id: '2', name: 'Beta Developer', email: 'beta@novatask.ai', role: 'Developer', status: 'synced' },
    { id: '3', name: 'Gamma Auditor', email: 'gamma@novatask.ai', role: 'Viewer', status: 'pending' },
  ]);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Administrator' | 'Developer' | 'Viewer' | 'Auditor'>('Developer');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newM: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'pending'
    };

    setMembers([...members, newM]);
    setNewName('');
    setNewEmail('');
    setNewRole('Developer');
    setSuccessMsg(`Invitation dispatched to ${newEmail} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      borderAccent: 'border-purple-500/20'
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      borderAccent: 'border-cyan-500/20'
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      borderAccent: 'border-pink-500/20'
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      borderAccent: 'border-yellow-500/20'
    }
  }[theme];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none max-w-5xl mx-auto leading-relaxed">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Team Collaboration Hub
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              AUTHORIZE NETWORK CONTRIBUTORS AND COLLABORATING NODES
            </p>
          </div>
        </div>

        {/* Invite and current members split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form invitations */}
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase pb-3 border-b border-white/5 flex items-center gap-2">
              <UserPlus className={`w-4 h-4 ${themeColors.text}`} /> TRANSMIT INVITE KEYS
            </h3>

            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-mono leading-relaxed">
                <Sparkles className="w-4 h-4 inline mr-1.5 shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Contributor Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Agent Phoenix"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-white placeholder:text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Cryptographic Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="phoenix@novatask.ai"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-white placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">Workspace Authorization Rank</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                >
                  <option value="Administrator">Administrator Rank</option>
                  <option value="Developer">Project Developer</option>
                  <option value="Viewer">Static Spectator (Viewer)</option>
                  <option value="Auditor">Compliance Auditor</option>
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-gradient-to-r ${themeColors.gradient} text-black font-extrabold rounded-xl transition hover:opacity-95 text-xs cursor-pointer`}
              >
                Incorporate Team Candidate
              </button>
            </form>
          </div>

          {/* Members list */}
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase pb-3 border-b border-white/5 flex items-center justify-between">
              <span>AUTHORIZED NETWORK MEMBERS ({members.length})</span>
              <span className={`text-[10px] ${themeColors.text} uppercase`}>CRYPTO ENCRYPTED</span>
            </h3>

            <div className="space-y-3.5 mt-4">
              {members.map((m) => (
                <div key={m.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-white font-mono text-sm uppercase">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white shrink-0">{m.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-slate-400 border border-white/5 bg-slate-950/60 px-2 py-0.5 rounded text-[9px] font-semibold">{m.role}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                      m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      m.status === 'synced' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                    }`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
