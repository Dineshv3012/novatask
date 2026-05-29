import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useWorkspace();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="relative flex flex-col items-center">
          {/* Futuristic Loading Spinner */}
          <div className="w-16 h-16 border-2 border-cyan-500 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border border-white/10 rounded-full blur-sm"></div>
          
          <p className="mt-8 text-sm tracking-[0.2em] uppercase font-semibold animate-pulse text-cyan-400">
            NovaTask AI Engine
          </p>
          <span className="mt-2 text-xs text-slate-500 font-mono">
            Synchronizing cryptographic storage systems...
          </span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
