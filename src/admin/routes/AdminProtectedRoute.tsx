import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAdminAuthenticated, adminUser } = useApp();

  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [unauthReason, setUnauthReason] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdminAuth = async () => {
      // 1. If local admin session exists in state, authorize
      if (isAdminAuthenticated && adminUser) {
        if (isMounted) {
          setIsAuthorized(true);
          setLoading(false);
        }
        return;
      }

      // 2. If Supabase is configured, check Supabase Auth session & admins table
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session || !session.user) {
            if (isMounted) {
              setIsAuthorized(false);
              setLoading(false);
            }
            return;
          }

          // Verify if user exists in `admins` table
          const { data: adminRows, error } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', session.user.id);

          if (error || !adminRows || adminRows.length === 0) {
            // User is authenticated in Supabase Auth BUT is NOT in the admins table!
            await supabase.auth.signOut();
            if (isMounted) {
              setIsAuthorized(false);
              setUnauthReason('unauthorized');
              setLoading(false);
            }
            return;
          }

          if (isMounted) {
            setIsAuthorized(true);
            setLoading(false);
          }
        } catch (err) {
          console.warn('Admin auth check exception:', err);
          if (isMounted) {
            setIsAuthorized(false);
            setLoading(false);
          }
        }
      } else {
        // Supabase not configured & local state not authenticated
        if (isMounted) {
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    };

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [isAdminAuthenticated, adminUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xs font-semibold text-slate-600">Verifying Admin Permissions...</div>
        </div>
      </div>
    );
  }

  if (unauthReason === 'unauthorized') {
    return <Navigate to="/admin/login?error=not_authorized" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
