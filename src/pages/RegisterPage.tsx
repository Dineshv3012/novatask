import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { motion } from 'motion/react';
import { Layers, Shield, Key, Mail, User, AlertCircle, Sparkles } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const RegisterPage = () => {
  const { currentUser, loginWithGoogle } = useWorkspace();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg('All workstation inputs are mandatory.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Accreditation passphrase must consist of at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Synchronize standard user profile details
      if (cred.user) {
        await updateProfile(cred.user, {
          displayName: username
        });
      }
      // Auto redirect handles location switch
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Storage core failed database registration initialization.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMsg('');
    try {
      await loginWithGoogle();
      // Auto redirect handles location switch
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Google workspace interface failed to authorize.');
    }
  };

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
          <p className="mt-1.5 text-xs text-slate-500 tracking-wider uppercase font-mono font-medium">REGISTER NEW WORKSPACE NODE</p>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Inputs Form */}
        <form onSubmit={handleEmailRegister} className="mt-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5 font-medium">OPERATOR USER INTERFACE ALIAS</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                aria-label="Username"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Station Operator"
                className="w-full bg-white/2 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-100 focus:outline-none focus:border-white/15 focus:bg-white/5 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          </div>

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
            <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5 font-medium">WORKSTATION ACCREDITATION PASSPHRASE</label>
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
            {loading ? 'DEPLOYING CRYPTO REQUISITIONS...' : 'PROVISION ACCOUNT CORE'}
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
          onClick={handleGoogleRegister}
          className="w-full py-3 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl font-semibold text-xs text-slate-200 transition-all flex items-center justify-center gap-2.5 font-mono cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 5.83 5.83 0 0 0 5.86-5.86V13h-5.86v3.25h2.86a2.86 2.86 0 1 1-2.86-2.86 5.83 5.83 0 0 0 5.86 5.86c0-3.23-2.63-5.86-5.86-5.86z"/>
          </svg>
          Google Cloud Credentials Auth
        </button>

        {/* Login Routing */}
        <p className="mt-8 text-center text-xs text-slate-500 font-mono">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
            Establish Session Link
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
