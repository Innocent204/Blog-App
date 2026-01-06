import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: any; session: any } | null>;
  register: (name: string, email: string, password: string, role?: 'admin' | 'editor') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    console.log('[Auth] Login attempt started for:', email);
    setIsLoading(true);
    try {
      console.log('[Auth] Calling signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('[Auth] signInWithPassword response:', { data, error });
      
      if (error) {
        console.error('[Auth] Login failed:', error);
        throw error;
      }
      
      if (data?.user) {
        console.log('[Auth] Login successful, user:', data.user);
        // Force a session check
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[Auth] Current session after login:', session);
      }
      
      return data;
    } catch (error) {
      console.error('[Auth] Error during login:', error);
      setUser(null);
      throw error;
    } finally {
      console.log('[Auth] Login attempt completed, setting loading to false');
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'editor' = 'editor') => {
    try {
      setIsLoading(true);
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create profile in the database
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('[Auth] AuthProvider mounted, setting up auth state listener...');
    let mounted = true;
    
    const fetchUserProfile = async (userId: string) => {
      if (!mounted) return null;
      
      console.log(`[Auth] Fetching profile for user: ${userId}`);
      
      // Add a timeout to the profile fetch
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
      );

      try {
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (profileError) {
          if (profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('[Auth] Error fetching profile:', profileError);
          } else {
            console.log('[Auth] No profile found, using default values');
          }
        }

        return profile;
      } catch (error) {
        console.error('[Auth] Error in profile fetch:', error);
        return null;
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth] Auth state changed: ${event}`, { 
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id
        });
        
        if (!mounted) return;
        
        try {
          if (session?.user) {
            console.log(`[Auth] User authenticated: ${session.user.email}`);
            
            // Get the profile (or null if it doesn't exist)
            const profile = await fetchUserProfile(session.user.id);
            
            const userData = {
              id: session.user.id,
              name: profile?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: profile?.role || 'editor',
            };
            
            console.log('[Auth] Updating user context with:', userData);
            setUser(userData);
          } else {
            console.log('[Auth] No active session, clearing user context');
            setUser(null);
          }
        } catch (error) {
          console.error('[Auth] Error in auth state change handler:', error);
          setUser(null);
        } finally {
          if (mounted) {
            console.log('[Auth] Auth state update complete, setting loading to false');
            setIsLoading(false);
          }
        }
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      try {
        console.log('[Auth] Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error);
          throw error;
        }
        
        console.log('[Auth] Session check complete. Session exists:', !!session);
        
        if (!session && mounted) {
          console.log('[Auth] No active session found');
          setIsLoading(false);
        } else if (session) {
          console.log('[Auth] Active session found, waiting for auth state change...');
        }
      } catch (error) {
        console.error('[Auth] Error in checkSession:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };
    
    checkSession();
    
    // Add timeout as a fallback in case the auth check hangs
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Auth check timeout reached, stopping loading');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    // Cleanup function
    return () => {
      mounted = false;
      subscription?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}