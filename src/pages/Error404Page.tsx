import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Compass, CornerDownLeft, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export const Error404Page = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black select-none">
      {/* Grid overlay background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35"></div>
      
      {/* Light bubbles */}
      <div className="absolute top-[30%] left-[30%] w-80 h-80 bg-rose-500/10 rounded-full blur-[110px] pointer-events-none animate-pulse"></div>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 relative z-10 w-full max-w-md p-8 md:p-10 bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-rose-500/15 shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/15">
          <ShieldAlert className="w-7 h-7 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-rose-400 font-bold uppercase block">VECTOR ERROR CODE: 404</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">SECTOR NOT FOUND</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2.5 max-w-sm mx-auto">
            The coordinate sector you sought is currently outside active communications parameters, or has been purged from system indexing blocks.
          </p>
        </div>

        {/* Telemetry mock diagnostic codes */}
        <div className="pt-4 border-t border-white/5 font-mono text-[9px] text-slate-500 text-left space-y-1.5 bg-slate-950/40 p-4 rounded-xl">
          <p className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-rose-500" /> REQUEST://COORDINATE/SECTOR_MISMATCH</p>
          <p className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-rose-500" /> CORE_INDEX_OVERFLOW_CRITICAL: NULL_POINTER</p>
          <p className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-rose-500" /> STATUS: ABORTING COGNITION LINK</p>
        </div>

        <div className="pt-2">
          <Link 
            to="/dashboard"
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 text-black font-extrabold rounded-xl transition-all shadow-md shadow-rose-500/10 hover:opacity-95 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4 stroke-[2.5]" />
            RETURN TO SAFE CORES
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
