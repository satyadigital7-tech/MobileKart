import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { adminLogin, isAdminAuthenticated } = useApp();

  const [viewMode, setViewMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('admin@hmc.in');
  const [password, setPassword] = useState('admin123');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const urlError = searchParams.get('error');
  const isResetFlow = searchParams.get('type') === 'recovery' || window.location.hash.includes('access_token');

  useEffect(() => {
    if (urlError === 'not_authorized') {
      setErrorMsg('You are not authorized to access the admin panel. Your account is not listed in the admins table.');
    }
    if (isResetFlow) {
      setViewMode('reset');
    }
  }, [urlError, isResetFlow]);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          const fallbackOk = adminLogin(email.trim(), password);
          if (fallbackOk) {
            navigate('/admin/dashboard');
            return;
          }
          setErrorMsg(error.message || 'Invalid admin credentials.');
          setLoading(false);
          return;
        }

        if (data.user) {
          const { data: adminRows } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', data.user.id);

          if (!adminRows || adminRows.length === 0) {
            await supabase.auth.signOut();
            setErrorMsg('You are not authorized to access the admin panel.');
            setLoading(false);
            return;
          }

          adminLogin(email.trim(), password);
          navigate('/admin/dashboard');
          return;
        }
      } else {
        const success = adminLogin(email.trim(), password);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setErrorMsg('Invalid admin credentials. Use admin@hmc.in / admin123');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + '/admin/login?type=recovery'
        });

        if (error) {
          setErrorMsg(error.message || 'Failed to send reset link.');
        } else {
          setSuccessMsg(`Password reset instructions have been sent to ${email.trim()}! Please check your email inbox.`);
        }
      } else {
        setSuccessMsg(`Demo Reset: Password reset email dispatched to ${email.trim()}. You may login with demo password admin123.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          setErrorMsg(error.message || 'Failed to update password.');
        } else {
          setSuccessMsg('Your password has been updated successfully! You can now log in.');
          setTimeout(() => {
            setViewMode('login');
          }, 1500);
        }
      } else {
        setSuccessMsg('Password updated successfully!');
        setTimeout(() => {
          setViewMode('login');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-900 font-sans selection:bg-teal-700 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img 
            src="/mobilekart-logo.png" 
            alt="MobileKart™ Logo" 
            className="h-16 w-auto object-contain mx-auto bg-white p-2 rounded-2xl shadow-md border border-slate-200" 
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">MobileKart™</h1>
          <p className="text-xs text-teal-700 font-extrabold uppercase tracking-widest">Administrator Portal</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-1.5 text-xs text-amber-900 shadow-sm">
          <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Default Demo Admin Credentials</span>
          </div>
          <div className="text-slate-700 font-medium">
            Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-teal-800 font-bold">admin@hmc.in</code>
          </div>
          <div className="text-slate-700 font-medium">
            Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">admin123</code>
          </div>
        </div>

        {/* Login / Reset Card Form */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-black text-slate-900 text-base">
              {viewMode === 'login' ? 'Sign In to Admin' : viewMode === 'forgot' ? 'Reset Admin Password' : 'Set New Password'}
            </h2>
            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 uppercase">
              Supabase Auth
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW MODE: SIGN IN */}
          {viewMode === 'login' && (
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-800 font-extrabold">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-10 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold transition"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Authenticate & Access Admin
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW MODE: FORGOT PASSWORD */}
          {viewMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs font-semibold">
              <p className="text-slate-600 font-medium">
                Enter your registered administrator email address. We will send you a link to reset your password.
              </p>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1.5">Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hmc.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-slate-600 hover:text-slate-900 font-bold flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW MODE: SET NEW PASSWORD */}
          {viewMode === 'reset' && (
            <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4 text-xs font-semibold">
              <p className="text-slate-600 font-medium">
                Enter your new administrator password below.
              </p>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New strong password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-10 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold transition"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                  </>
                ) : (
                  'Save New Password & Login'
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-slate-600 hover:text-slate-900 font-bold flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
