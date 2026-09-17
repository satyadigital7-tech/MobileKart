import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useApp();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout notice:', e);
    }
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-700 selection:text-white">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/mobilekart-logo.png" 
              alt="MobileKart™ Logo" 
              className="h-9 w-auto object-contain" 
            />
            <div>
              <div className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                MobileKart™
                <span className="bg-teal-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                  ADMIN PORTAL
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">Operations Command Center</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium shadow-sm">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span>
                <strong className="text-slate-900 font-extrabold">{adminUser?.name || 'Administrator'}</strong> ({adminUser?.email || 'admin@hmc.in'})
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold px-3.5 py-1.5 rounded-xl border border-red-200 transition shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-[11px] text-slate-500 font-medium">
        Hyderabad Mobile Care • Internal Operations & Management Portal • Confidential & Secured
      </footer>
    </div>
  );
};
