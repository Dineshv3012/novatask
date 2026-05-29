import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  Shield, 
  Activity, 
  CheckSquare, 
  Cpu, 
  Calendar, 
  Users, 
  ArrowRight,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black select-none">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Futuristic Floating Lights */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none animate-pulse"></div>

      {/* Navigation Header */}
      <header className="relative max-w-7xl mx-auto h-20 px-6 flex items-center justify-between z-10 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Layers className="w-5 h-5 text-black font-extrabold" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 font-mono">
            NOVATASK <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-mono font-medium">
          <a href="#features" className="hover:text-cyan-400 transition">CAPABILITIES</a>
          <a href="#preview" className="hover:text-cyan-400 transition">SYSTEM MOCK</a>
          <a href="#pricing" className="hover:text-cyan-400 transition">LICENSE SCHEMES</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white rounded-full text-xs font-mono transition-all">
            ACCESS NODE
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-95 text-black font-semibold rounded-full text-xs font-sans tracking-wide shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.03]">
            LAUNCH FREE CORE
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8 flex items-center gap-2 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          INTELLIGENT RE-ENGINEERING IS ALIVE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ contentVisibility: 'auto' }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-500 leading-[1.1] max-w-4xl"
        >
          Dynamic Productivity for Quantum Workspace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-sans"
        >
          Orchestrate workflows, monitor team synchronities, and conquer core assignments inside a high-contrast glassmorphic console powered by server-side Gemini intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-600 hover:scale-[1.03] text-black font-bold rounded-full shadow-2xl shadow-cyan-500/20 transition-all flex items-center gap-2 mr-2">
            Get Operational Space FREE
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <a href="#features" className="px-8 py-4 bg-white/2 hover:bg-white/5 border border-white/5 rounded-full text-slate-300 font-semibold transition-all">
            Inspect Capabilities
          </a>
        </motion.div>

        {/* UI Preview Showcase Card */}
        <motion.div
          id="preview"
          style={{ contentVisibility: 'auto' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 w-full max-w-5xl rounded-3xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-xl"></div>
          <div className="rounded-2xl overflow-hidden bg-slate-900/80 border border-white/5 flex flex-col shadow-inner aspect-[16/10]">
            {/* Mock Header */}
            <div className="h-10 bg-slate-950/80 px-4 border-b border-white/5 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/50"></span>
              </div>
              <span>DASHBOARD://WORKSPACE/NOVATASK_AI</span>
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                <span>SECURE PROTOCOL ACTIVE</span>
              </div>
            </div>
            {/* Mock Body */}
            <div className="flex-1 p-6 grid grid-cols-4 gap-4 text-left font-sans">
              <div className="col-span-1 bg-slate-950/60 p-4 border border-white/5 rounded-2xl flex flex-col gap-3">
                <div className="h-6 w-24 bg-white/5 rounded-md"></div>
                <div className="h-4 w-full bg-white/2 rounded-md"></div>
                <div className="h-4 w-4/5 bg-white/2 rounded-md"></div>
                <div className="mt-auto h-8 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-lg opacity-20"></div>
              </div>
              <div className="col-span-3 grid grid-rows-3 gap-4">
                <div className="row-span-1 bg-slate-950/30 p-4 border border-white/5 rounded-2xl flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-5 w-32 bg-white/10 rounded-md"></div>
                    <div className="h-3.0 w-48 bg-white/5 rounded-md"></div>
                  </div>
                  <div className="h-9 w-9 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="row-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="h-3 w-12 bg-rose-500/20 text-rose-400 rounded p-1 font-mono text-[9px] text-center">Urgent</div>
                    <div className="h-4 w-full bg-white/10 rounded-md mt-2"></div>
                    <div className="h-3 w-3/4 bg-white/5 rounded-md"></div>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="h-3 w-12 bg-cyan-500/20 text-cyan-400 rounded p-1 font-mono text-[9px] text-center font-semibold">Active</div>
                    <div className="h-4 w-full bg-white/10 rounded-md mt-2"></div>
                    <div className="h-3 w-4/5 bg-white/5 rounded-md"></div>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="h-3 w-12 bg-green-500/20 text-green-400 rounded p-1 font-mono text-[9px] text-center">Review</div>
                    <div className="h-4 w-full bg-white/10 rounded-md mt-2"></div>
                    <div className="h-3 w-2/3 bg-white/5 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-slate-950/40 relative z-10" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-cyan-400 font-semibold">Core Matrix Engines</h2>
            <p className="mt-4 text-3xl sm:text-5xl font-bold text-white tracking-tight">Supercharge team delivery with cybernetics diagnostics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/2 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Gemini Productivity Oracle</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Receive smart recommendations periodically based directly on your task velocity, focus goals, and categorized loads.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quantum Kanban Boards</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Organize tasks under Pending, In Progress, Review, Completed, and Overdue columns with simple mouse triggers and interactive boards.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative Workspaces</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Assign team roles, invite developers, track live audits, and synchronize project steps in unified live database boards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Licensing section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 relative z-10" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-purple-400 font-semibold">License Matrix</h2>
            <p className="mt-4 text-3xl font-bold text-white">Select Your Strategic Workspace Tier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Tier */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col relative group">
              <h4 className="text-white text-xl font-bold font-mono">Standard Operating Core</h4>
              <p className="mt-2 text-xs text-slate-400 font-mono">Basic operational systems.</p>
              <div className="my-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 font-mono">PER MONTH / FOREVER</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-3 mb-10 py-4 border-t border-white/5 flex-1 leading-relaxed">
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Complete Task Board & Kanban Card System</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Local real-time Firebase synchronization</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Basic diagnostic logging & stats</li>
              </ul>
              <Link to="/register" className="w-full text-center py-3.5 bg-white/5 hover:bg-white/10 rounded-full font-bold text-sm tracking-wide text-white border border-white/10 transition-all">
                DEPLOY STANDARD KERNEL
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl p-10 flex flex-col relative group shadow-2xl shadow-cyan-500/5">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full text-[10px] font-bold text-black font-sans uppercase tracking-widest shadow-lg">
                Recommended Core
              </div>
              <h4 className="text-white text-xl font-bold font-mono flex items-center gap-2">Nova Operator <Sparkles className="w-4 h-4 text-cyan-400" /></h4>
              <p className="mt-2 text-xs text-cyan-400 font-mono font-medium">Full AI power active.</p>
              <div className="my-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">$12</span>
                <span className="text-xs text-slate-500 font-mono">PER MONTH / BILLED YEARLY</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-3 mb-10 py-4 border-t border-cyan-500/20 flex-1 leading-relaxed">
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Direct server-side Gemini API tips</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Absolute team-collaborative spaces & boards</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Advanced analytics tracking with charts</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Full notification triggers & security</li>
              </ul>
              <Link to="/register" className="w-full text-center py-3.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-black hover:opacity-95 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-purple-500/20 transition-all">
                LAUNCH NOVA ORACLE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Professional Footer */}
      <footer className="border-t border-white/5 py-10 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between z-10 relative text-xs text-slate-500 font-mono gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-black" />
          </div>
          <span>NovaTask AI Workstation v2.1</span>
        </div>
        <span>© 2026 NOVATASK AI CORP. ALL PROTOCOLS SECURED.</span>
        <div className="flex gap-4">
          <span className="cursor-not-allowed hover:text-cyan-400 transition">SYSTEM HEALTH: 100%</span>
        </div>
      </footer>
    </div>
  );
};
