import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

export interface User {
  id: string;
  name: string;
  email: string;
  loyaltyPoints: number;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 
                  session.user.user_metadata?.full_name || 
                  session.user.identities?.[0]?.identity_data?.name ||
                  session.user.identities?.[0]?.identity_data?.full_name ||
                  session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            loyaltyPoints: session.user.user_metadata?.loyalty_points || 1250,
            avatar_url: session.user.user_metadata?.avatar_url || 
                       session.user.user_metadata?.picture ||
                       session.user.identities?.[0]?.identity_data?.avatar_url ||
                       session.user.identities?.[0]?.identity_data?.picture
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 
                  session.user.user_metadata?.full_name || 
                  session.user.identities?.[0]?.identity_data?.name ||
                  session.user.identities?.[0]?.identity_data?.full_name ||
                  session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            loyaltyPoints: session.user.user_metadata?.loyalty_points || 1250,
            avatar_url: session.user.user_metadata?.avatar_url || 
                       session.user.user_metadata?.picture ||
                       session.user.identities?.[0]?.identity_data?.avatar_url ||
                       session.user.identities?.[0]?.identity_data?.picture
          };
          setUser(userData);
          
          // Show different welcome message based on auth method
          const authProvider = session.user.app_metadata?.provider;
          if (authProvider === 'google') {
            toast.success(`Selamat datang ${userData.name}! Berhasil masuk dengan Google 🌽`, {
              duration: 4000
            });
          } else if (authProvider === 'facebook') {
            toast.success(`Selamat datang ${userData.name}! Berhasil masuk dengan Facebook 🌽`, {
              duration: 4000
            });
          } else if (authProvider === 'email') {
            toast.success(`Selamat datang ${userData.name}! 🌽`);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast.success('Berhasil keluar dari akun');
        } else if (event === 'TOKEN_REFRESHED') {
          // Handle token refresh silently
          console.log('Auth token refreshed successfully');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Gagal keluar dari akun');
        return;
      }
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Gagal keluar dari akun');
    }
  };

  return {
    user,
    loading,
    setUser,
    signOut
  };
}