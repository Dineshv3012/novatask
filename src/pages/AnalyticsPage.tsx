import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { TaskStatus, TaskPriority } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Activity, 
  CheckCircle, 
  Eye, 
  PieChart as PieIcon, 
  BarChart2, 
  HelpCircle 
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { tasks, theme } = useWorkspace();

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      chartPrimary: '#a855f7',
      chartSecondary: '#6366f1',
      glow: 'shadow-purple-500/15',
      slices: ['#c084fc', '#818cf8', '#6366f1', '#4f46e5']
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      chartPrimary: '#22d3ee',
      chartSecondary: '#14b8a6',
      glow: 'shadow-cyan-500/15',
      slices: ['#67e8f9', '#22d3ee', '#14b8a6', '#0d9488']
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      chartPrimary: '#ec4899',
      chartSecondary: '#f43f5e',
      glow: 'shadow-pink-500/15',
      slices: ['#f472b6', '#f43f5e', '#fb7185', '#ec4899']
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      chartPrimary: '#eab308',
      chartSecondary: '#f59e0b',
      glow: 'shadow-yellow-500/15',
      slices: ['#fef08a', '#facc15', '#f59e0b', '#d97706']
    }
  }[theme];

  // Calculations for charts
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const reviewCount = tasks.filter(t => t.status === TaskStatus.REVIEW).length;
  const overdueCount = tasks.filter(t => t.status === TaskStatus.OVERDUE).length;

  const completionPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // 1. Priority distribution Pie Data
  const priorities = Object.values(TaskPriority);
  const priorityData = priorities.map((p) => ({
    name: `${p} Priority`,
    value: tasks.filter(t => t.priority === p).length
  })).filter(item => item.value > 0);

  // 2. Status break-down Bar Data
  const statusData = [
    { name: 'Pending', count: pendingCount },
    { name: 'Active', count: inProgressCount },
    { name: 'Review', count: reviewCount },
    { name: 'Finished', count: completedCount },
    { name: 'Overdue', count: overdueCount }
  ];

  // 3. Category burn-down Area Data
  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));
  const categoryData = categories.slice(0, 6).map((cat) => {
    const catTasks = tasks.filter(t => t.category === cat);
    return {
      sector: cat,
      all: catTasks.length,
      done: catTasks.filter(t => t.status === TaskStatus.COMPLETED).length
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none leading-relaxed">
        
        {/* Page title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Metrics & Workspace Analytics
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              REAL-TIME DIAGNOSTIC CHARTS DELIVER VELOCITY MODULATION
            </p>
          </div>
        </div>

        {/* Global Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${themeColors.gradient} flex items-center justify-center text-black`}>
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">PIPELINE VELOCITY</span>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1">{completionPercent}% Complete</h2>
            </div>
          </div>

          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">REDLINE INTERCEPTORS</span>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1">{overdueCount} Overdue Nodes</h2>
            </div>
          </div>

          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">RECORDS DISPATCHED</span>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1">{completedCount} Finished</h2>
            </div>
          </div>
        </div>

        {/* Recharts Graphs Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Status Breakdown Bar chart */}
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <BarChart2 className={`w-4 h-4 ${themeColors.text}`} />
              <h3 className="text-xs font-extrabold text-white tracking-wider font-mono">MISSION COMPLETION BY STATUS</h3>
            </div>
            <div className="h-64 mt-4">
              {total === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                  Inject task data to build telemetry metrics.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="count" fill={themeColors.chartPrimary} radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : themeColors.chartPrimary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Density distribution Pie Chart */}
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <PieIcon className={`w-4 h-4 ${themeColors.text}`} />
              <h3 className="text-xs font-extrabold text-white tracking-wider font-mono">PRIORITY MATRIX DENSITY</h3>
            </div>
            <div className="h-64 mt-4 flex items-center justify-center">
              {priorityData.length === 0 ? (
                <div className="text-xs text-slate-600 font-mono">
                  Inject task priority limits to build density charts.
                </div>
              ) : (
                <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={themeColors.slices[index % themeColors.slices.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legends list */}
                  <div className="space-y-2 mt-4 sm:mt-0 select-none">
                    {priorityData.map((p, idx) => (
                      <div key={p.name} className="flex items-center gap-2.5 text-xs font-mono">
                        <span 
                          className="w-2.5 h-2.5 rounded-full block shrink-0" 
                          style={{ backgroundColor: themeColors.slices[idx % themeColors.slices.length] }}
                        ></span>
                        <span className="text-slate-400 capitalize">{p.name.replace('Priority', '')}:</span>
                        <span className="text-white font-bold">{p.value} task{p.value > 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Area Sector chart */}
          <div className="lg:col-span-2 p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <TrendingUp className={`w-4 h-4 ${themeColors.text}`} />
              <h3 className="text-xs font-extrabold text-white tracking-wider font-mono">SECTOR DISPATCH VOLUMES</h3>
            </div>
            <div className="h-68 mt-4">
              {categoryData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-600 font-mono">
                  Inject categorized milestones to draw sector trends.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaColorPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColors.chartPrimary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={themeColors.chartPrimary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="areaColorSecondary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColors.chartSecondary} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={themeColors.chartSecondary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="sector" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="all" name="Created Task Nodes" stroke={themeColors.chartPrimary} fillOpacity={1} fill="url(#areaColorPrimary)" />
                    <Area type="monotone" dataKey="done" name="Completed Protocols" stroke={themeColors.chartSecondary} fillOpacity={1} fill="url(#areaColorSecondary)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
