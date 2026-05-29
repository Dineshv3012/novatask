import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Bell, Check, Trash2, MailOpen, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const NotificationCenterPage = () => {
  const { notifications, markNotifRead, removeNotif, theme } = useWorkspace();
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      glow: 'shadow-purple-500/15',
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      glow: 'shadow-cyan-500/15',
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      glow: 'shadow-pink-500/15',
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-500/15',
    }
  }[theme];

  const displayedNotifs = filterMode === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none max-w-3xl mx-auto leading-relaxed">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Notifications & Warnings Feed
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              MONITOR SYSTEM TRIGGER ALERTER MESSAGES
            </p>
          </div>
        </div>

        {/* Filter Selection Panel */}
        <div className="flex justify-between items-center p-4 bg-slate-900/30 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-full border border-white/5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4.5 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                filterMode === 'all' 
                  ? 'bg-white/5 text-slate-100 border border-white/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilterMode('unread')}
              className={`px-4.5 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                filterMode === 'unread' 
                  ? 'bg-white/5 text-slate-100 border border-white/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Unacknowledged ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            CORE SECURED METRIC INDEX
          </span>
        </div>

        {/* Notification listing queue */}
        <div className="space-y-4">
          {displayedNotifs.length === 0 ? (
            <div className="py-24 text-center bg-slate-900/10 border border-white/5 rounded-3xl text-sm font-mono text-slate-600">
              No alert profiles loaded under current {filterMode.toUpperCase()} scope.
            </div>
          ) : (
            displayedNotifs.map((n) => (
              <div
                key={n.notificationId}
                className={`p-5 rounded-2xl border transition duration-150 flex items-start gap-4 ${
                  !n.read 
                    ? 'bg-slate-900/80 border-white/10 text-slate-150 shadow-md' 
                    : 'bg-slate-950/20 border-white/5 text-slate-400'
                }`}
              >
                {/* Specific Alerts Style Icons */}
                <div className="mt-0.5 shrink-0">
                  {n.type === 'success' ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : n.type === 'warning' ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : n.type === 'alert' ? (
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Info className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Info summary */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[10px] font-mono uppercase font-semibold block mb-1 ${
                        n.type === 'success' ? 'text-emerald-400' :
                        n.type === 'warning' ? 'text-amber-400' :
                        n.type === 'alert' ? 'text-rose-400' : 'text-cyan-400'
                      }`}>{n.type} ALERT Sector</span>
                      <p className="text-xs font-semibold leading-relaxed text-slate-100">{n.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <button
                          onClick={() => markNotifRead(n.notificationId)}
                          aria-label="Acknowledge informational alert"
                          className={`p-1.5 bg-slate-950/60 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded transition text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer`}
                        >
                          <MailOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Acknowledge</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeNotif(n.notificationId)}
                        aria-label="Delete informational warning"
                        className="p-1.5 hover:bg-rose-500/10 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-500 block mt-3 font-mono">
                    SIGNAL DETECTED: {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};
