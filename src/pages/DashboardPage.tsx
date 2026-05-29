import React, { useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Compass, 
  RefreshCw,
  Award,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { TaskStatus, TaskPriority } from '../types';

export const DashboardPage = () => {
  const { 
    userProfile, 
    tasks, 
    logs, 
    theme, 
    aiSuggestions, 
    aiLoading, 
    refreshAISuggestions 
  } = useWorkspace();

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      glow: 'shadow-purple-500/15',
      borderAccent: 'border-purple-500/30'
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      glow: 'shadow-cyan-500/15',
      borderAccent: 'border-cyan-500/30'
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      glow: 'shadow-pink-500/15',
      borderAccent: 'border-pink-500/30'
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-500/15',
      borderAccent: 'border-yellow-500/30'
    }
  }[theme];

  // Calculable statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const criticalTasksCount = tasks.filter(t => t.priority === TaskPriority.CRITICAL && t.status !== TaskStatus.COMPLETED).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate dynamic productivity score
  // Completed, in-progress weightage minus overdue
  const baseScore = Math.min(100, Math.round((completedTasks * 10 + inProgressTasks * 5) / (totalTasks || 1) * 8));
  const finalProductivityScore = totalTasks === 0 ? 0 : baseScore;

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        
        {/* Workspace Welcomer & Core status metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome, <span className={`bg-clip-text text-transparent bg-gradient-to-r ${themeColors.gradient}`}>{userProfile?.username || 'Station Operator'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              Workstation Core Node // Cryptographic Index Verified // Current: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/2 p-2 rounded-xl border border-white/5 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>VELOCITY: {totalTasks > 0 ? `${completionRate}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>CORE HEALTH: SECURE</span>
            </div>
          </div>
        </div>

        {/* Quantified Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm hover:border-white/15 transition duration-300">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">QUANTUM ASSIGNMENTS</span>
            <span className="text-3xl font-bold font-mono text-white mt-1.5 block">{totalTasks}</span>
            <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between">
              <span>ACTIVE PIPELINE</span>
              <span className={themeColors.text}>{pendingTasks + inProgressTasks} tasks</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm hover:border-white/15 transition duration-300">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">CRITICAL ALERT NODES</span>
            <span className="text-3xl font-bold font-mono text-rose-400 mt-1.5 block">{criticalTasksCount}</span>
            <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between">
              <span>STATUS OVERWATCH</span>
              <span className="text-rose-500">Immediate attention</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm hover:border-white/15 transition duration-300">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">COMPLETED PROTOCOLS</span>
            <span className="text-3xl font-bold font-mono text-emerald-400 mt-1.5 block">{completedTasks}</span>
            <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between">
              <span>DELIVERY SCORE</span>
              <span className="text-emerald-400">{completionRate}% complete</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm hover:border-white/15 transition duration-300">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">WORKSPACE PERFORMANCE</span>
            <span className="text-3xl font-bold font-mono text-cyan-404 flex items-baseline gap-1.5 mt-1.5 block">
              {finalProductivityScore}% <TrendingUp className="w-4 h-4 text-cyan-400 self-center" />
            </span>
            <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between">
              <span>DIAGNOSTICS RATING</span>
              <span className="text-cyan-400">Excellent index</span>
            </div>
          </div>
        </div>

        {/* Center Grid: Gemini Oracle Suggestions & Pomodoro/Stats chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gemini AI Recommendations Widget */}
          <div className="lg:col-span-2 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${themeColors.text} animate-bounce`} />
                  <h3 className="text-sm font-extrabold text-white tracking-wide font-sans">
                    GEMINI WORKSPACE SUGGESTIONS
                  </h3>
                </div>
                <button
                  onClick={refreshAISuggestions}
                  disabled={aiLoading}
                  aria-label="Retrieve AI ideas"
                  className="p-1 px-3.5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-full transition text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                  {aiLoading ? 'REQUANTIZING...' : 'RETRIEVE NEW IDEAS'}
                </button>
              </div>

              {/* Suggestions display */}
              <div className="mt-5 space-y-4">
                {aiLoading ? (
                  // Elegant glowing skeleton items
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-2">
                        <div className="h-4 bg-white/10 rounded-md w-2/5"></div>
                        <div className="h-3 bg-white/5 rounded-md w-4/5"></div>
                      </div>
                    ))}
                  </div>
                ) : aiSuggestions.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    Unable to parse workspace heuristics. Click Retrieve above to trigger Gemini advice core.
                  </div>
                ) : (
                  aiSuggestions.slice(0, 3).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl hover:border-white/10 transition flex items-start gap-4 relative group"
                    >
                      {/* Priority Tag Side Indicators */}
                      <div className="mt-0.5">
                        <span className={`w-2 h-2 rounded-full block ${
                          item.priority === TaskPriority.CRITICAL || item.priority === 'Critical' ? 'bg-rose-500 animate-ping' :
                          item.priority === TaskPriority.HIGH || item.priority === 'High' ? 'bg-amber-400' :
                          item.priority === TaskPriority.MEDIUM || item.priority === 'Medium' ? 'bg-cyan-500' : 'bg-slate-500'
                        }`}></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 border border-white/5 bg-slate-900/60 rounded text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed leading-relaxed font-sans">{item.reason}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <Link to="/board" className={`text-xs font-semibold ${themeColors.text} hover:underline flex items-center gap-1.5`}>
                Deploy task to active board
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Side: Interactive Dial Pomodoro Timer */}
          <div className="space-y-6">
            <PomodoroTimer />
          </div>

        </div>

        {/* Audit Trails and Quick List View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Tasks list snippet */}
          <div className="lg:col-span-2 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="text-sm font-extrabold text-white tracking-wide font-sans">
                CRITICAL FOCUS FLOW (HIGH/CRITICAL STATUS)
              </h3>
              <Link to="/board" className={`text-xs font-semibold ${themeColors.text} hover:underline`}>
                Full Board
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {tasks.filter(t => t.priority === TaskPriority.HIGH || t.priority === TaskPriority.CRITICAL).slice(0, 4).length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs font-mono">
                  No high priority blockages detected in active sectors.
                </div>
              ) : (
                tasks.filter(t => t.priority === TaskPriority.HIGH || t.priority === TaskPriority.CRITICAL).slice(0, 4).map((task) => (
                  <div key={task.taskId} className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-1.5 h-6 rounded-full block ${task.priority === TaskPriority.CRITICAL ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">{task.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono tracking-wide">{task.category} // Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-1 rounded-sm uppercase tracking-wider font-mono ${
                      task.status === TaskStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400' :
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{task.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Event Logger Logs Feed */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-extrabold text-white tracking-wide font-sans pb-4 border-b border-white/5">
              TELEMETRY OPERATIONS FEED
            </h3>

            <div className="mt-4 space-y-4 max-h-60 overflow-y-auto font-mono text-[10px] text-slate-500 divide-y divide-white/5">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-slate-600">
                  No log parameters cataloged yet.
                </div>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <div key={log.logId} className="pt-3 block">
                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                      <span className="uppercase tracking-wider truncate max-w-[20ch]">{log.action.replace('_', ' ')}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString(undefined, { hour12: false })}</span>
                    </div>
                    <p className="text-slate-500">{log.details || 'Operational record committed.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
