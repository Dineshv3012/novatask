import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { User, Mail, Shield, ShieldCheck, Sparkles, AlertCircle, Edit, Calendar } from 'lucide-react';
import { updateUserProfile } from '../lib/db';

export const UserProfilePage = () => {
  const { currentUser, userProfile, theme } = useWorkspace();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '');
      setBio(userProfile.bio || '');
      setProfileImage(userProfile.profileImage || '');
    }
  }, [userProfile]);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setSuccess(false);
    try {
      // If user clears image URL, fall back to matching DiceBear robotic seed
      const finalImg = profileImage.trim() 
        ? profileImage 
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'nova'}`;

      await updateUserProfile(currentUser.uid, {
        username,
        bio,
        profileImage: finalImg
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      glow: 'shadow-purple-500/15',
      borderAccent: 'border-purple-500/20'
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      glow: 'shadow-cyan-500/15',
      borderAccent: 'border-cyan-500/20'
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      glow: 'shadow-pink-500/15',
      borderAccent: 'border-pink-500/20'
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-500/15',
      borderAccent: 'border-yellow-500/20'
    }
  }[theme];

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none max-w-4xl mx-auto leading-relaxed">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Operator Profile Node
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              EDIT COGNITIVE PARAMETERS AND IDENTIFICATION METADATA
            </p>
          </div>
        </div>

        {/* Identity Showcase Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="relative group">
              <img 
                src={userProfile?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'nova'}`} 
                alt="Profile Matrix Avatar" 
                className={`w-28 h-28 rounded-full border-4 ${themeColors.borderAccent} bg-slate-800 shadow-xl`}
              />
              <div className="absolute inset-0 rounded-full border border-white/10 blur-sm pointer-events-none"></div>
            </div>

            <h3 className="text-lg font-bold text-teal-50 mt-4 font-sans">{userProfile?.username || 'Station Operator'}</h3>
            <span className="text-[10px] font-mono mt-1 px-3 py-1 border border-white/5 bg-slate-950/60 rounded text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              SYSTEM ROLE: USER
            </span>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mt-4 italic">
              "{userProfile?.bio || 'Core workstation operator monitoring quantum assignments.'}"
            </p>

            <div className="mt-6 pt-4 border-t border-white/5 w-full flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>COMMITTED SINCE: {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          {/* Form Editor column */}
          <div className="p-6 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl md:col-span-2 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase pb-3 border-b border-white/5 flex items-center gap-1.5">
              <Edit className="w-4 h-4 text-cyan-400" /> Write Operator Details
            </h3>

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 font-mono">
                <Sparkles className="w-4 h-4" />
                <span>OPERATIONAL BIOMETRIC RE-CONFIGURED SUCCESSFULLY.</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">SYSTEM ACCESS ALIAS / USERNAME</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">ACCESSIBILITY IDENTIFICATION EMAIL (IMMUTABLE)</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={userProfile?.email || ''}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-slate-300 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">CUSTOM PROFILE AVATAR RESOURCE LINK (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Leave empty to use automatic robot seed avatar..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 px-3 text-slate-100 placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">COGNITIVE INDEX STATEMENT / BIO SUMMARY</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 px-3 text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 bg-gradient-to-r ${themeColors.gradient} text-black font-extrabold rounded-xl hover:opacity-95 transition-all text-xs cursor-pointer ${loading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading ? 'RE-ALIGNED CRITICAL VALUES...' : 'WRITE CHANGES TO SECURE SECTORS'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
