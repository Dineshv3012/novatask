import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  BarChart2, 
  Calendar, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  Layout, 
  LogOut, 
  Bell, 
  Settings, 
  User, 
  Users, 
  Loader2, 
  Plus, 
  Search,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    userProfile, 
    notifications, 
    theme, 
    logoutUser, 
    searchQuery, 
    setSearchQuery,
    markNotifRead,
    removeNotif
  } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Menu Definition
  const menuItems = [
    { name: 'Core Dashboard', path: '/dashboard', icon: Layout },
    { name: 'Task Board', path: '/board', icon: CheckSquare },
    { name: 'Metrics & Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Quantum Calendar', path: '/calendar', icon: Calendar },
    { name: 'Team Hub', path: '/team', icon: Users },
    { name: 'Profile Node', path: '/profile', icon: User },
    { name: 'Workspace Config', path: '/settings', icon: Settings },
  ];

  // Map theme variables
  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      bgGlow: 'from-purple-600/10 via-slate-950 to-black',
      gradient: 'from-purple-500 to-indigo-500',
      accent: 'border-purple-500/30',
      activeText: 'text-purple-300',
      glowShadow: 'shadow-purple-500/30',
      ring: 'focus:ring-purple-500/50',
      bgSolid: 'bg-purple-600'
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      bgGlow: 'from-cyan-600/10 via-slate-950 to-black',
      gradient: 'from-cyan-400 to-teal-500',
      accent: 'border-cyan-500/30',
      activeText: 'text-cyan-300',
      glowShadow: 'shadow-cyan-500/30',
      ring: 'focus:ring-cyan-500/50',
      bgSolid: 'bg-cyan-500'
    },
    'sunset-pink': {
      text: 'text-pink-400',
      bgGlow: 'from-pink-600/10 via-slate-950 to-black',
      gradient: 'from-pink-500 to-rose-400',
      accent: 'border-pink-500/30',
      activeText: 'text-pink-300',
      glowShadow: 'shadow-pink-500/30',
      ring: 'focus:ring-pink-500/50',
      bgSolid: 'bg-pink-500'
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      bgGlow: 'from-yellow-600/10 via-slate-950 to-black',
      gradient: 'from-yellow-400 to-amber-500',
      accent: 'border-yellow-500/30',
      activeText: 'text-yellow-300',
      glowShadow: 'shadow-yellow-500/30',
      ring: 'focus:ring-yellow-500/50',
      bgSolid: 'bg-yellow-400'
    }
  }[theme];

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden bg-gradient-to-tr ${themeColors.bgGlow}`}>
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4f46e5]/10 rounded-full blur-[120px] pointer-events-none origin-center animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#06b6d4]/10 rounded-full blur-[120px] pointer-events-none origin-center animate-pulse"></div>

      {/* Persistent Left Sidebar - Responsive Panel */}
      <motion.aside
        animate={{ width: collapsed ? '4.5rem' : '16rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col relative bg-slate-900/40 backdrop-blur-xl border-r border-white/5 z-20"
      >
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${themeColors.gradient} flex items-center justify-center shadow-lg ${themeColors.glowShadow}`}>
                  <Layers className="w-5 h-5 text-black font-extrabold" />
                </div>
                <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 font-mono">
                  NOVATASK <span className={`${themeColors.text}`}>AI</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-tr ${themeColors.gradient} flex items-center justify-center`}>
              <Layers className="w-5 h-5 text-black" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-white/5 rounded-md transition text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Workstation Status Indicator */}
        {!collapsed && (
          <div className="p-4 mx-3 my-4 bg-white/2 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 flex flex-col gap-1.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                SYSTEM ACTIVE
              </span>
              <span className={`font-semibold ${themeColors.text}`}>PRO</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${themeColors.gradient}`} style={{ width: '84%' }}></div>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>INTELLIGENCE CORES</span>
              <span>84%</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-2 space-y-1 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative group ${
                  isActive 
                    ? `bg-gradient-to-r ${themeColors.gradient} text-black font-semibold shadow-lg ${themeColors.glowShadow}` 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-black' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`} />
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate font-medium text-sm font-sans"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {/* Micro-dot active indicator for collapsed state */}
                {collapsed && isActive && (
                  <span className={`absolute right-1 w-1.5 h-1.5 rounded-full ${themeColors.bgSolid}`}></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile node */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={userProfile?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.username || 'nova'}`} 
              alt="avatar" 
              className={`w-9 h-9 rounded-full border-2 ${themeColors.accent} bg-slate-800`}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{userProfile?.username || 'Station Operator'}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">{userProfile?.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={logoutUser}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-xl transition-all text-xs font-mono`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>TERMINATE SESSION</span>}
          </button>
        </div>
      </motion.aside>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        
        {/* Main Workspace Header */}
        <header className="h-16 bg-slate-950/30 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Query system files, priority tags, keywords..."
                value={searchQuery}
                aria-label="Search tasks"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/2 border border-white/5 text-slate-100 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-white/10 transition-all font-mono placeholder:text-slate-600 focus:bg-white/5"
              />
            </div>
          </div>

          {/* User Interaction Hub */}
          <div className="flex items-center gap-4">
            {/* Quick Add Task */}
            <button
              onClick={() => navigate('/board')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-black font-semibold rounded-full text-xs shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Quantum Task</span>
            </button>

            {/* Notifications Dropdown Panel Trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-full transition text-slate-300 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full text-black bg-gradient-to-r ${themeColors.gradient} flex items-center justify-center`}>
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden z-20"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase">Quantified Alerts</h4>
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className={`text-[10px] font-medium ${themeColors.text} hover:underline`}>
                        View Feed
                      </Link>
                    </div>

                    <div className="mt-2 text-slate-300 space-y-2 max-h-60 overflow-y-auto divide-y divide-white/5">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-slate-500 text-xs font-mono">
                          No active system warnings.
                        </div>
                      ) : (
                        notifications.slice(0, 4).map((n) => (
                          <div key={n.notificationId} className={`pt-2.5 pb-1 flex flex-col gap-1 text-[11px] ${!n.read ? 'bg-white/2 px-1 text-slate-100' : 'text-slate-400'}`}>
                            <div className="flex justify-between items-start">
                              <span className={`font-semibold capitalize text-[10px] font-mono ${
                                n.type === 'success' ? 'text-emerald-400' :
                                n.type === 'warning' ? 'text-amber-400' :
                                n.type === 'alert' ? 'text-rose-400' : 'text-cyan-400'
                              }`}>{n.type}</span>
                              <div className="flex gap-2">
                                {!n.read && (
                                  <button onClick={() => markNotifRead(n.notificationId)} className={`hover:underline text-[9px] ${themeColors.text}`}>
                                    Acknowledge
                                  </button>
                                )}
                                <button onClick={() => removeNotif(n.notificationId)} className="hover:text-slate-200 text-slate-500 font-sans text-[10px]">
                                  ×
                                </button>
                              </div>
                            </div>
                            <p className="line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Core Subview Node rendering */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile bottom global layout navigation bar */}
        <nav className="md:hidden h-14 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-10 w-full">
          {menuItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 ${isActive ? themeColors.text : 'text-slate-500'}`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-[9px] font-mono font-medium">{item.name.replace('Quantum', '').replace('Core', '')}</span>
              </Link>
            );
          })}
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 p-2 ${location.pathname === '/profile' ? themeColors.text : 'text-slate-500'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">Node</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};
