import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';
import { signInWithProvider, getAuthErrorMessage, checkAuthProviders } from '../utils/supabase/auth-config';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUser: (user: any) => void;
}

export function AuthModal({ open, onOpenChange, setUser }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState({
    google: { available: true, configured: true },
    facebook: { available: true, configured: true }
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Check auth providers status when modal opens
  useEffect(() => {
    if (open) {
      checkAuthProviders().then(setProvidersStatus);
    }
  }, [open]);

  // Handle social login with enhanced error handling
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setSocialLoading(provider);
      
      // Check if provider is available
      const providerStatus = providersStatus[provider];
      if (!providerStatus.available || !providerStatus.configured) {
        toast.error(`${provider === 'google' ? 'Google' : 'Facebook'} login belum tersedia. Silakan gunakan email.`);
        return;
      }
      
      // Show loading toast
      toast.loading(`Menghubungkan ke ${provider === 'google' ? 'Google' : 'Facebook'}...`, {
        id: `${provider}-loading`
      });

      await signInWithProvider(provider);
      
      // The user will be redirected to the OAuth provider
      // Don't dismiss the loading toast here - it will be handled by the redirect
      console.log(`${provider} OAuth redirect initiated successfully`);
      
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.dismiss(`${provider}-loading`);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSocialLoading(null);
    }
  };

  // Handle email/password authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in with email/password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Sign in error:', error);
          toast.error(getAuthErrorMessage(error));
          return;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email,
            loyaltyPoints: 1250 // Default loyalty points
          });
          
          toast.success(`Selamat datang kembali di THEFMSMKT, ${data.user.user_metadata?.name || 'Corn Lover'}! 🌽`);
          onOpenChange(false);
          setFormData({ email: '', password: '', name: '' });
        }
      } else {
        // Sign up with email/password
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          toast.error(getAuthErrorMessage(error));
          return;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: formData.name,
            email: data.user.email,
            loyaltyPoints: 0 // New users start with 0 points
          });
          
          toast.success(`Selamat datang di THEFMSMKT, ${formData.name}! Akun berhasil dibuat. 🎉`);
          onOpenChange(false);
          setFormData({ email: '', password: '', name: '' });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--neutral-900)] border-[var(--neutral-800)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            {isLogin ? 'Selamat Datang Kembali' : 'Bergabung dengan THEFMSMKT'}
          </DialogTitle>
          <DialogDescription className="text-[var(--neutral-400)] text-center text-sm">
            {isLogin ? 'Masuk untuk melanjutkan perjalanan corn Anda' : 'Buat akun untuk mendapatkan penawaran eksklusif'}
          </DialogDescription>
        </DialogHeader>

        {/* Social Login Buttons */}
        <div className="space-y-3 mt-6">
          <Button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading || socialLoading !== null || !providersStatus.google.available}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
{socialLoading === 'google' ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Menghubungkan...
              </>
            ) : (
              'Masuk dengan Google'
            )}
          </Button>

          <Button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading || socialLoading !== null || !providersStatus.facebook.available}
            className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
{socialLoading === 'facebook' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menghubungkan...
              </>
            ) : (
              'Masuk dengan Facebook'
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--neutral-700)]"></div>
          <span className="text-[var(--neutral-400)] text-sm">or continue with email</span>
          <div className="flex-1 h-px bg-[var(--neutral-700)]"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-[var(--neutral-400)]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            className="text-[var(--neon-green)] hover:underline font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}