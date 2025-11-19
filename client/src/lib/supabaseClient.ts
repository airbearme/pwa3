import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xckggdmqfqajatytmiko.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhja2dnZG1xZnFhamF0eXRtaWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjY0MzEsImV4cCI6MjA3MTE0MjQzMX0.16ENL-9-QPSxuN620NGO-BndYpHCLuEdVQeR_lZqYA0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Critical: Supabase environment variables are missing. Using fallback values for production.'
  );
}

export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { 
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey,
      },
    }
  }
);

// Add global error handling for failed fetch
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Failed to fetch')) {
      console.error('Supabase connection issue detected:', event.reason);
      // Optional: Show user-friendly error message
    }
  });
