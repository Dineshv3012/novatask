import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

export const CalendarPage = () => {
  const { tasks, theme } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date());

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      borderAccent: 'border-purple-500/20',
      bgHover: 'hover:bg-purple-500/5',
      bgSolid: 'bg-purple-500',
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      borderAccent: 'border-cyan-500/20',
      bgHover: 'hover:bg-cyan-500/5',
      bgSolid: 'bg-cyan-400',
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      borderAccent: 'border-pink-500/20',
      bgHover: 'hover:bg-pink-500/5',
      bgSolid: 'bg-pink-500',
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      borderAccent: 'border-yellow-500/20',
      bgHover: 'hover:bg-yellow-500/5',
      bgSolid: 'bg-yellow-400',
    }
  }[theme];

  // Calendar Engine logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of matching month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Total days in matching month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const emptyPreCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Quantum January', 'Hyperlink February', 'Telemetry March', 'Workspace April', 
    'Quantum May', 'Digital June', 'Cryptograph July', 'Operational August', 
    'Spectrum September', 'Overwatch October', 'Cybernetic November', 'Synapse December'
  ];

  // Group tasks by due date
  const getTasksForDay = (dayNum: number): Task[] => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const tDate = new Date(t.dueDate);
      return tDate.getDate() === dayNum && 
             tDate.getMonth() === month && 
             tDate.getFullYear() === year;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none h-full flex flex-col leading-relaxed">
        
        {/* Calendar Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Quantum Workspace Calendar
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              REAL-TIME SPRINT INTERVAL DEADLINE MATRIX
            </p>
          </div>
        </div>

        {/* Toggles bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <CalendarIcon className={`w-5 h-5 ${themeColors.text}`} />
            <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-2 bg-white/2 hover:bg-white/5 border border-white/5 rounded-full transition text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="p-2 bg-white/2 hover:bg-white/5 border border-white/5 rounded-full transition text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid container */}
        <div className="grid grid-cols-7 gap-1 bg-slate-950/40 p-4 border border-white/5 rounded-3xl overflow-hidden flex-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-2.5 text-center text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 border-b border-white/5">
              {d}
            </div>
          ))}

          {/* Empty Prefills */}
          {emptyPreCells.map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-white/3 opacity-20"></div>
          ))}

          {/* Operational Days cells */}
          {daysArray.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isToday = new Date().getDate() === day && 
                            new Date().getMonth() === month && 
                            new Date().getFullYear() === year;

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2.5 border-b border-r border-white/5 transition flex flex-col justify-between ${themeColors.bgHover} ${
                  isToday ? 'bg-slate-900/40 outline outline-1 outline-cyan-500/30' : ''
                }`}
              >
                {/* Cell Number heading */}
                <div className="flex justify-between items-center pb-2.5 border-b border-white/2">
                  <span className={`text-[10px] font-mono leading-none ${
                    isToday ? `${themeColors.text} font-bold` : 'text-slate-400'
                  }`}>{day}</span>
                  {dayTasks.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${themeColors.bgSolid}`}></span>
                  )}
                </div>

                {/* Listing tasks on that day */}
                <div className="flex-1 space-y-1.5 mt-2.5 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((t) => (
                    <div 
                      key={t.taskId} 
                      title={`${t.title} [${t.status}]`}
                      className={`p-1.5 rounded text-[9px] font-sans truncate font-medium flex items-center justify-between gap-1.5 select-none ${
                        t.status === TaskStatus.COMPLETED ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/20' :
                        t.priority === TaskPriority.CRITICAL ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        t.priority === TaskPriority.HIGH ? 'bg-amber-500/5 text-amber-400 border border-amber-500/15' : 
                        'bg-slate-900 border border-white/5 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
};
