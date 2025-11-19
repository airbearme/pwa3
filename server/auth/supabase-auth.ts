import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// For development/testing, use mock client when credentials are missing
const isMockMode = !supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('mock');

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Running with mock Supabase auth client - no real authentication will occur');
}

// Create admin client for server-side operations
let supabaseAdmin: any;

if (isMockMode) {
  // Mock admin client for development/testing
  supabaseAdmin = {
    auth: {
      getUser: async (token: string) => ({ data: { user: null }, error: null }),
      signUp: async (options: any) => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async (credentials: any) => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    },
    from: (table: string) => ({
      select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) })
    })
  };
} else {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { supabaseAdmin };

// Auth middleware for protecting routes
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const user = await supabaseAdmin.auth.getUser(token);
    
    if (!user.data.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    (req as any).user = user.data.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Role-based access control
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !roles.includes(user.user_metadata?.role || 'user')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Auth helper functions
export async function signUp(email: string, password: string, metadata: any) {
  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabaseAdmin.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createUserProfile(userId: string, profile: any) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: userId,
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}
