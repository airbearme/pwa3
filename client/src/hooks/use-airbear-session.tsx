import { useEffect, useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

type AuthRole = 'admin' | 'driver' | 'user';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AuthRole | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: AuthRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AirbearSessionContext = createContext<AuthContextType | undefined>(undefined);

function extractRole(user: User | null): AuthRole | null {
  const metadata = user?.user_metadata ?? user?.app_metadata;
  if (metadata?.role === 'admin') return 'admin';
  if (metadata?.role === 'driver') return 'driver';
  return 'user';
}

export function AirbearSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = supabaseClient.auth.getSession();
    currentSession.then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, role: AuthRole) => {
    setLoading(true);
    setError(null);
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      role: extractRole(user),
      loading,
      error,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, loading, error]
  );

  return <AirbearSessionContext.Provider value={value}>{children}</AirbearSessionContext.Provider>;
}

export function useAirbearSession() {
  const context = useContext(AirbearSessionContext);
  if (!context) {
    throw new Error('useAirbearSession must be used within AirbearSessionProvider');
  }
  return context;
}
