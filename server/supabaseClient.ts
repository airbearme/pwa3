import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// For development/testing, use mock client when credentials are missing
const isMockMode = !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes('mock');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Running with mock Supabase client - no real database operations will occur');
}

let supabaseAdmin: any;

// Mock client for development/testing
if (isMockMode) {
  supabaseAdmin = {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        }),
        order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) })
      }),
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve({ data: [{ id: 'mock_' + Date.now() }], error: null })
        })
      }),
      update: () => ({
        set: () => ({
          where: () => ({
            returning: () => Promise.resolve({ data: [{ id: 'updated_' + Date.now() }], error: null })
          })
        })
      })
    })
  };
} else {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

export { supabaseAdmin };
