import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { motion } from 'motion/react';
import { Layers, Shield, Key, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const LoginPage = () => {
  const { currentUser, loginWithGoogle, theme } = useWorkspace();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Redirect if logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('All workstation inputs are mandatory.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auto-redirect handles navigation
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Access Denied. Database authorization failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setInfoMsg('');
    try {
      await loginWithGoogle();
      // Auto-redirect handles navigation
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Google workspace interface failed to authorize.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Specify a target email coordinates to transmit reset code.');
      return;
    }
    setErrorMsg('');
    setInfoMsg('');
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMsg('Cryptography override instructions transmitted. Check your inbox.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failure deploying password recovery transmission.');
    }
  };

  const themeClass = {
    'neon-purple': 'text-purple-400 border-purple-500/30 ring-purple-500/50 bg-purple-500 hover:shadow-purple-500/20',
    'cyan-glow': 'text-cyan-400 border-cyan-500/30 ring-cyan-500/50 bg-cyan-400 hover:shadow-cyan-500/20',
    'sunset-pink': 'text-pink-400 border-pink-500/30 ring-pink-500/50 bg-pink-500 hover:shadow-pink-500/20',
    'cyberpunk': 'text-yellow-400 border-yellow-500/30 ring-yellow-500/50 bg-yellow-400 hover:shadow-yellow-500/20'
  }[theme];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/25 via-slate-950 to-black select-none">
      {/* Background decoration elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 md:p-10 bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        {/* Core Workspace Brand */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-white/5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/15 mb-4">
            <Layers className="w-6 h-6 text-black font-extrabold" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white opacity-95 to-slate-400 font-mono">
            NOVATASK AI
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 tracking-wider uppercase font-mono font-medium">AUTHORIZED WORKSPACE INTERFACE</p>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {infoMsg && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0" />
            <p className="leading-relaxed">{infoMsg}</p>
          </div>
        )}

        {/* Inputs Form */}
        <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5 font-medium">CRYPTOGRAPHIC COGNIZANT EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                aria-label="Email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@workspace.ai"
                className="w-full bg-white/2 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-100 focus:outline-none focus:border-white/15 focus:bg-white/5 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 font-medium">WORKSTATION ACCREDITATION PASSPHRASE</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[9px] font-mono text-cyan-400 hover:underline hover:text-cyan-300"
              >
                BYPASS?
              </button>
            </div>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                aria-label="Password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/2 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-100 focus:outline-none focus:border-white/15 focus:bg-white/5 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-xs font-mono font-bold tracking-wider text-black bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {loading ? 'SYNCHRONIZING AUTH KEY...' : 'CONNECT SECURE TERMINAL'}
          </button>
        </form>

        {/* Separator */}
        <div className="my-6 flex items-center justify-between text-[10px] text-slate-600 font-mono">
          <div className="h-px bg-white/5 flex-1 select-none"></div>
          <span className="px-3">FEDERATED SECURITY OVERLAYS</span>
          <div className="h-px bg-white/5 flex-1 select-none"></div>
        </div>

        {/* Federated Sign In Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl font-semibold text-xs text-slate-200 transition-all flex items-center justify-center gap-2.5 font-mono cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 5.83 5.83 0 0 0 5.86-5.86V13h-5.86v3.25h2.86a2.86 2.86 0 1 1-2.86-2.86 5.83 5.83 0 0 0 5.86 5.86c0-3.23-2.63-5.86-5.86-5.86z"/>
          </svg>
          Google Cloud Credentials Auth
        </button>

        {/* Register Routing */}
        <p className="mt-8 text-center text-xs text-slate-500 font-mono">
          First deployment request?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
            Register Workspace Node
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
