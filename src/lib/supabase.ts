import { createClient } from '@supabase/supabase-js';

// Using Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? '***URL set***' : 'MISSING URL');
console.log('Supabase Anon Key:', supabaseAnonKey ? '***Key set***' : 'MISSING KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check your .env file');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);  
  
  // Force a re-render when auth state changes
  const eventToDispatch = new CustomEvent('supabase_auth_change', {
    detail: { event, session }
  });
  window.dispatchEvent(eventToDispatch);
});

// Debug: Log all auth events
const events = [
  'SIGNED_IN',
  'SIGNED_OUT',
  'TOKEN_REFRESHED',
  'USER_UPDATED',
  'PASSWORD_RECOVERY',
  'USER_DELETED'
];

events.forEach((_event) => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(`Auth event: ${event}`, session);
  });
});

// Debug: Log any potential errors
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && !session) {
    console.error('SIGNED_IN event fired but no session!');
  }
});
