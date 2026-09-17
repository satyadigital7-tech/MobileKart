import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, Wrench, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated } = useApp();

  const [email, setEmail] = useState('admin@hmc.in');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg('Invalid admin credentials. Use admin@hmc.in / admin123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-700 to-amber-500 p-0.5 mx-auto flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-teal-800">
              <Wrench className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Hyderabad Mobile Care</h1>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Operations & Admin Portal</p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-1 text-xs text-amber-900 shadow-sm">
          <div className="font-black flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Default Demo Admin Credentials</span>
          </div>
          <div className="font-semibold text-slate-700">
            Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-slate-900 font-bold">admin@hmc.in</code>
          </div>
          <div className="font-semibold text-slate-700">
            Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-slate-900 font-bold">admin123</code>
          </div>
        </div>

        {/* Login Card Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-black text-slate-900 text-base">Sign In to Admin Portal</h2>
            <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded uppercase">Secure Authorization</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-800 font-extrabold mb-1.5">Admin Email / Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hmc.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-teal-700 font-bold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-extrabold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-teal-700 font-bold"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Lock className="w-4 h-4" /> Authenticate & Open Dashboard
            </button>
          </form>

          <div className="pt-2 text-center text-xs">
            <Link to="/" className="text-teal-800 font-bold hover:underline">
              ← Return to Hyderabad Mobile Care Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
