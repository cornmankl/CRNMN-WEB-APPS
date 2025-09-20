import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { checkAuthProviders } from '../utils/supabase/auth-config';

interface AuthDebugPanelProps {
  show: boolean;
  onClose: () => void;
}

export function AuthDebugPanel({ show, onClose }: AuthDebugPanelProps) {
  const [authStatus, setAuthStatus] = useState<any>({});
  const [session, setSession] = useState<any>(null);
  const [providersStatus, setProvidersStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      loadAuthData();
    }
  }, [show]);

  const loadAuthData = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      setSession(session);
      
      // Check providers
      const providers = await checkAuthProviders();
      setProvidersStatus(providers);
      
      // Get auth status
      setAuthStatus({
        sessionExists: !!session,
        userLoggedIn: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        provider: session?.user?.app_metadata?.provider,
        emailVerified: session?.user?.email_confirmed_at ? true : false,
        lastSignIn: session?.user?.last_sign_in_at,
        sessionError: sessionError?.message
      });
      
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      console.log(`Testing ${provider} login...`);
      
      // This won't actually redirect, just test the configuration
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true // Don't actually redirect for testing
        }
      });
      
      console.log(`${provider} test result:`, { data, error });
      
      if (error) {
        alert(`${provider} Error: ${error.message}`);
      } else {
        alert(`${provider} configuration looks good!`);
      }
    } catch (error: any) {
      console.error(`${provider} test error:`, error);
      alert(`${provider} Test Error: ${error.message}`);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[var(--neutral-900)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--neutral-800)] p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold neon-text">🔧 Auth Debug Panel</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-full"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading auth status...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Auth Status */}
              <div className="card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="material-icons">account_circle</span>
                  Current Auth Status
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Session Exists:</div>
                  <div className={authStatus.sessionExists ? 'text-green-400' : 'text-red-400'}>
                    {authStatus.sessionExists ? '✓ Yes' : '✗ No'}
                  </div>
                  
                  <div>User Logged In:</div>
                  <div className={authStatus.userLoggedIn ? 'text-green-400' : 'text-red-400'}>
                    {authStatus.userLoggedIn ? '✓ Yes' : '✗ No'}
                  </div>
                  
                  {authStatus.email && (
                    <>
                      <div>Email:</div>
                      <div className="text-neutral-300">{authStatus.email}</div>
                    </>
                  )}
                  
                  {authStatus.provider && (
                    <>
                      <div>Provider:</div>
                      <div className="text-neutral-300 capitalize">{authStatus.provider}</div>
                    </>
                  )}
                  
                  <div>Email Verified:</div>
                  <div className={authStatus.emailVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {authStatus.emailVerified ? '✓ Yes' : '⚠ No'}
                  </div>
                </div>
                
                {authStatus.sessionError && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
                    <strong>Session Error:</strong> {authStatus.sessionError}
                  </div>
                )}
              </div>

              {/* Social Providers Status */}
              <div className="card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="material-icons">cloud</span>
                  Social Providers Status
                </h3>
                <div className="space-y-3">
                  {Object.entries(providersStatus).map(([provider, status]: [string, any]) => (
                    <div key={provider} className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status.available && status.configured ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="capitalize font-semibold">{provider}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => testSocialLogin(provider as 'google' | 'facebook')}
                          className="px-3 py-1 bg-[var(--neon-green)] text-black rounded text-xs font-semibold hover:bg-green-400 transition-colors"
                        >
                          Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Details */}
              {session && (
                <div className="card p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="material-icons">info</span>
                    Session Details
                  </h3>
                  <pre className="bg-black/50 p-3 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              )}

              {/* Environment Check */}
              <div className="card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="material-icons">settings</span>
                  Environment
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Current URL:</div>
                  <div className="text-neutral-300 break-all">{window.location.origin}</div>
                  
                  <div>HTTPS:</div>
                  <div className={window.location.protocol === 'https:' ? 'text-green-400' : 'text-yellow-400'}>
                    {window.location.protocol === 'https:' ? '✓ Secure' : '⚠ HTTP'}
                  </div>
                  
                  <div>Localhost:</div>
                  <div className={window.location.hostname === 'localhost' ? 'text-yellow-400' : 'text-green-400'}>
                    {window.location.hostname === 'localhost' ? '⚠ Local' : '✓ Production'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-4">
                <h3 className="font-bold mb-3">Quick Actions</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={loadAuthData}
                    className="px-4 py-2 bg-[var(--neon-green)] text-black rounded font-semibold hover:bg-green-400 transition-colors"
                  >
                    Refresh Data
                  </button>
                  
                  {session && (
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      console.log('Current auth status:', authStatus);
                      console.log('Current session:', session);
                      console.log('Providers status:', providersStatus);
                    }}
                    className="px-4 py-2 bg-neutral-700 text-white rounded font-semibold hover:bg-neutral-600 transition-colors"
                  >
                    Log to Console
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="card p-4 bg-blue-900/20 border-blue-500/30">
                <h3 className="font-bold mb-3 text-blue-400">🔍 Troubleshooting Tips</h3>
                <div className="text-sm space-y-2 text-blue-200">
                  <p>• Jika "Provider not enabled" → Periksa konfigurasi di Supabase Dashboard</p>
                  <p>• Jika redirect error → Pastikan Site URL sudah diset dengan benar</p>
                  <p>• Jika "Invalid credentials" → Periksa Client ID/Secret di provider settings</p>
                  <p>• Untuk testing → Gunakan deployed app (HTTPS), bukan localhost</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}