import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2,
  Wrench,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const CustomerAuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAuthModalOpen, 
    closeCustomerAuthModal, 
    authModalContext, 
    customerLogin, 
    customerSignup 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSuccessFlow = () => {
    closeCustomerAuthModal();
    if (authModalContext === 'checkout') {
      navigate('/checkout');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!emailOrPhone || !password) {
          setErrorMsg('Please enter email/phone and password.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured && emailOrPhone.includes('@')) {
          const { error } = await supabase.auth.signInWithPassword({
            email: emailOrPhone.trim(),
            password
          });
          if (error) {
            customerLogin(emailOrPhone.trim(), password);
          } else {
            customerLogin(emailOrPhone.trim(), password);
          }
        } else {
          customerLogin(emailOrPhone.trim(), password);
        }

        setSuccessMsg('Successfully signed in!');
        setTimeout(() => {
          handleSuccessFlow();
        }, 400);
      } else {
        // Sign Up
        if (!fullName || !emailOrPhone || !password) {
          setErrorMsg('Please fill out all required fields.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured && emailOrPhone.includes('@')) {
          const { error } = await supabase.auth.signUp({
            email: emailOrPhone.trim(),
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone || ''
              }
            }
          });
          if (error) {
            console.warn('Supabase customer signup notice:', error.message);
          }
        }

        customerSignup(fullName, emailOrPhone.trim(), phone, password);
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          handleSuccessFlow();
        }, 400);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans selection:bg-teal-700 selection:text-white animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-0 relative">
        
        {/* Close Button */}
        <button
          onClick={closeCustomerAuthModal}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-amber-900 text-white p-6 space-y-2 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            {authModalContext === 'repair' ? (
              <Wrench className="w-6 h-6 text-amber-300" />
            ) : authModalContext === 'checkout' ? (
              <ShoppingBag className="w-6 h-6 text-teal-200" />
            ) : (
              <User className="w-6 h-6 text-amber-300" />
            )}
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {authModalContext === 'repair'
              ? 'Login to Book Repair Service'
              : authModalContext === 'checkout'
              ? 'Login to Complete Checkout'
              : 'Customer Account Login'}
          </h2>
          <p className="text-xs text-teal-100 font-medium max-w-xs mx-auto">
            {authModalContext === 'repair'
              ? 'Please authenticate to confirm doorstep technician visit in Hyderabad.'
              : authModalContext === 'checkout'
              ? 'Sign in to save delivery address & track your order.'
              : 'Sign in to view your repair bookings, orders, and wishlist.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Login / Sign Up Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-black">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === 'login' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === 'signup' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Kiran Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-800 font-extrabold mb-1">Email or Mobile Number *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="kiran@gmail.com or 9849012345"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-slate-800 font-extrabold mb-1">WhatsApp Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98490 12345"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-800 font-extrabold mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-10 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-bold"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : mode === 'login' ? (
                'Sign In & Continue'
              ) : (
                'Create Account & Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
