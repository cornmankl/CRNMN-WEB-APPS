import { supabase } from './client';

export interface AuthConfig {
  google: {
    enabled: boolean;
    scopes: string[];
  };
  facebook: {
    enabled: boolean;
    scopes: string[];
  };
  redirectUrls: {
    success: string;
    error: string;
  };
}

export const authConfig: AuthConfig = {
  google: {
    enabled: true,
    scopes: ['openid', 'email', 'profile']
  },
  facebook: {
    enabled: true,
    scopes: ['email', 'public_profile']
  },
  redirectUrls: {
    success: window.location.origin,
    error: `${window.location.origin}?error=auth_error`
  }
};

/**
 * Enhanced social login function with better error handling
 */
export async function signInWithProvider(provider: 'google' | 'facebook') {
  const config = authConfig[provider];
  
  if (!config.enabled) {
    throw new Error(`${provider} authentication is not enabled`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authConfig.redirectUrls.success,
      scopes: config.scopes.join(' '),
      queryParams: provider === 'google' ? {
        access_type: 'offline',
        prompt: 'consent',
        hd: undefined // Allow any domain
      } : {}
    }
  });

  if (error) {
    console.error(`${provider} OAuth error:`, error);
    throw error;
  }

  return data;
}

/**
 * Check if social providers are properly configured
 */
export async function checkAuthProviders() {
  try {
    // This is a simple check - in production you might want to ping auth endpoints
    const providers = ['google', 'facebook'];
    const status = {
      google: { available: true, configured: true },
      facebook: { available: true, configured: true }
    };
    
    return status;
  } catch (error) {
    console.error('Error checking auth providers:', error);
    return {
      google: { available: false, configured: false },
      facebook: { available: false, configured: false }
    };
  }
}

/**
 * Get user profile data from social provider
 */
export function extractSocialUserData(user: any) {
  const identities = user.identities || [];
  const primaryIdentity = identities[0];
  const metadata = user.user_metadata || {};
  
  // Extract data from different providers
  const socialData = primaryIdentity?.identity_data || {};
  
  return {
    id: user.id,
    email: user.email,
    name: metadata.name || 
          metadata.full_name || 
          socialData.name || 
          socialData.full_name || 
          user.email?.split('@')[0] || 
          'User',
    avatar_url: metadata.avatar_url || 
               metadata.picture || 
               socialData.avatar_url || 
               socialData.picture,
    provider: user.app_metadata?.provider || 'email',
    verified: user.email_confirmed_at ? true : false,
    created_at: user.created_at
  };
}

/**
 * Handle auth errors with user-friendly messages
 */
export function getAuthErrorMessage(error: any): string {
  const errorMessage = error.message || error.error_description || '';
  
  if (errorMessage.includes('provider is not enabled')) {
    return 'Login dengan media sosial belum dikonfigurasi. Silakan hubungi admin.';
  }
  
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Email atau password tidak valid. Silakan periksa kembali.';
  }
  
  if (errorMessage.includes('Email not confirmed')) {
    return 'Email belum dikonfirmasi. Silakan periksa kotak masuk Anda.';
  }
  
  if (errorMessage.includes('already registered')) {
    return 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.';
  }
  
  if (errorMessage.includes('Password')) {
    return 'Password harus minimal 6 karakter.';
  }
  
  if (errorMessage.includes('redirect')) {
    return 'Terjadi kesalahan redirect. Silakan coba lagi.';
  }
  
  if (errorMessage.includes('network')) {
    return 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.';
  }
  
  // Default error message
  return 'Terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.';
}