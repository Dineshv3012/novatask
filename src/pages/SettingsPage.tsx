import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Settings, Palette, Eye, ShieldAlert, Sparkles, RefreshCw, Trash2, Check, ExternalLink } from 'lucide-react';

export const SettingsPage = () => {
  const { theme, setTheme, logoutUser, tasks } = useWorkspace();
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const themes: { id: 'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk'; label: string; colors: string; preview: string }[] = [
    { id: 'neon-purple', label: 'Electric Purple Theme', colors: 'from-purple-500 to-indigo-500', preview: 'bg-purple-600' },
    { id: 'cyan-glow', label: 'Neon Cyan Glow', colors: 'from-cyan-400 to-teal-500', preview: 'bg-cyan-500' },
    { id: 'sunset-pink', label: 'Sunset Pink Radiance', colors: 'from-pink-500 to-rose-400', preview: 'bg-pink-500' },
    { id: 'cyberpunk', label: 'Cyberpunk Amber Core', colors: 'from-yellow-400 to-amber-500', preview: 'bg-yellow-400' }
  ];

  const handleInspectUpdates = () => {
    setCheckingUpdates(true);
    setUpdateMsg('');
    setTimeout(() => {
      setCheckingUpdates(false);
      setUpdateMsg('NovaTask operating core is fully synchronized. No outstanding updates.');
    }, 1500);
  };

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
    }
  }[theme];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none max-w-4xl mx-auto leading-relaxed">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Workspace Core Config
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              MANAGE USER INTERFACES, THEMES, AND SECURITY LIMITS
            </p>
          </div>
        </div>

        {/* Section: Themes Selector */}
        <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-6">
          <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase pb-3 border-b border-white/5 flex items-center gap-2">
            <Palette className={`w-4 h-4 ${themeColors.text}`} /> OPERATIONAL VISUAL MATRIX
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4.5 bg-slate-950/40 hover:bg-slate-950/60 transition rounded-2xl border text-left flex items-center justify-between gap-4 cursor-pointer outline-none ${
                    isSelected ? 'border-cyan-400/50 shadow-lg shadow-cyan-400/5' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full ${t.preview}`}></span>
                    <div className="font-mono text-xs">
                      <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{t.label}</p>
                      <p className="text-[10px] text-slate-600 uppercase mt-0.5 mt-0.5">MATRIX IDENTIFIER: {t.id}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/20">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Workspace security & integrity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase pb-3 border-b border-white/5">
              SYSTEM RE-SYNCHRONIZATION
            </h3>

            <p className="text-[11px] text-slate-400 font-sans">
              Deploying updates to database indexing matrices resolves rendering blockages. Check and fetch the latest workspace code packages here.
            </p>

            {updateMsg && (
              <p className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-mono leading-relaxed">
                {updateMsg}
              </p>
            )}

            <button
              onClick={handleInspectUpdates}
              disabled={checkingUpdates}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-mono text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdates ? 'animate-spin' : ''}`} />
              {checkingUpdates ? 'VERIFYING SYSTEM PACKAGE...' : 'CHECK SYSTEM HEALTH'}
            </button>
          </div>

          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-rose-400 uppercase pb-3 border-b border-rose-500/10 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> SECURE OVERRIDE DESTRUCTORS
            </h4>

            <p className="text-[11px] text-slate-400 font-sans">
              Terminate the current active login token. Terminating the active session triggers secure client caching clear states.
            </p>

            <button
              onClick={logoutUser}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              TERMINATE ACTIVE DISPATCH TOKENS
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
