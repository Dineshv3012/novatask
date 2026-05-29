import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Brain } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const PomodoroTimer = () => {
  const { theme } = useWorkspace();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete: swap modes
            if (mode === 'work') {
              setMode('break');
              setMinutes(5);
              try {
                // Play a brief synth notification sound safely
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
              } catch (e) {}
            } else {
              setMode('work');
              setMinutes(25);
            }
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const themeColors = {
    'neon-purple': 'text-purple-400 stroke-purple-500 border-purple-500/20 bg-purple-500/10',
    'cyan-glow': 'text-cyan-400 stroke-cyan-400 border-cyan-500/20 bg-cyan-400/10',
    'sunset-pink': 'text-pink-400 stroke-pink-500 border-pink-500/20 bg-pink-500/10',
    'cyberpunk': 'text-yellow-400 stroke-yellow-400 border-yellow-500/20 bg-yellow-400/10'
  }[theme];

  // Percentage complete for circle display
  const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const percentage = (currentSeconds / totalSeconds) * 100;
  const strokeDashoffset = 220 - (220 * percentage) / 100;

  return (
    <div className="bg-slate-900/30 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-slate-400 font-mono">
        <Clock className="w-3.5 h-3.5" />
        <span>TEMPORAL SECTOR: {mode.toUpperCase()}</span>
      </div>

      {/* Mode Switches */}
      <div className="flex gap-2.5 p-1 bg-slate-950/60 rounded-full border border-white/5 mb-6">
        <button
          onClick={() => switchMode('work')}
          className={`px-4.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
            mode === 'work' 
              ? `bg-white/5 text-slate-100 border border-white/10` 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Brain className="w-3 h-3" /> Focus
          </span>
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-4.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
            mode === 'break' 
              ? `bg-white/5 text-slate-100 border border-white/10` 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Coffee className="w-3 h-3" /> Break
          </span>
        </button>
      </div>

      {/* Interactive Dial Circular progress */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            className="stroke-slate-800"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            className={`transition-all duration-1000 ${themeColors}`}
            strokeWidth="4"
            strokeDasharray="220"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center font-mono">
          <span className="text-3xl font-bold tracking-tight text-white leading-none">
            {String(minutes).padStart(2, '0')}
          </span>
          <span className="text-lg text-slate-500 leading-none mt-1">
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
          className={`p-3 bg-white/3 hover:bg-white/5 border border-white/5 rounded-full text-white hover:scale-105 transition active:scale-95 cursor-pointer`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          aria-label="Reset timer"
          className="p-3 bg-white/3 hover:bg-white/5 border border-white/5 rounded-full text-slate-400 hover:text-white hover:scale-105 transition active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
