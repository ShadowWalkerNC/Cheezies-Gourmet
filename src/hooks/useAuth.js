/**
 * useAuth.js
 * Global auth hook -- use this anywhere in Cheezies to get the current user.
 *
 * Usage:
 *   const { user, loading, signOut } = useAuth();
 */
import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  return { user, loading, signOut, isAdmin };
}
