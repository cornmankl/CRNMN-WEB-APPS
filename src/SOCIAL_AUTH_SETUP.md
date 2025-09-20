# 🔐 Social Authentication Setup Guide

Your THEFMSMKT CMNTYPLX app now includes Facebook and Google authentication! Here's how to complete the setup:

## 🚀 What's Already Done

✅ **Frontend Implementation**
- Google and Facebook login buttons added to AuthModal
- Proper Supabase OAuth integration
- Session management and user state handling
- Loading states and error handling
- Toast notifications for auth events
- User avatar support from social providers

✅ **Backend Configuration** 
- Supabase client properly configured
- Auth state management with automatic session refresh
- User data extraction from social providers
- Sign out functionality

## ⚙️ Required Setup (Supabase Dashboard)

### 1. **Google OAuth Setup** (5 minutes)

**In Supabase Dashboard:**
1. Go to **Authentication → Providers**
2. Find **Google** and click Configure
3. Toggle **Enable sign in with Google**
4. You'll need:
   - **Google Client ID** 
   - **Google Client Secret**

**Get Google Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable Google+ API
4. Go to **Credentials → Create Credentials → OAuth client ID**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   https://your-app-domain.vercel.app/auth/callback
   ```
7. Copy Client ID and Client Secret to Supabase

**📝 Detailed Guide:** https://supabase.com/docs/guides/auth/social-login/auth-google

### 2. **Facebook OAuth Setup** (5 minutes)

**In Supabase Dashboard:**
1. Go to **Authentication → Providers** 
2. Find **Facebook** and click Configure
3. Toggle **Enable sign in with Facebook**
4. You'll need:
   - **Facebook App ID**
   - **Facebook App Secret**

**Get Facebook Credentials:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app or select existing one
3. Add **Facebook Login** product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
5. Copy App ID and App Secret to Supabase

**📝 Detailed Guide:** https://supabase.com/docs/guides/auth/social-login/auth-facebook

### 3. **Update Site URL** (1 minute)

**In Supabase Dashboard:**
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your deployed app URL:
   ```
   https://your-app.vercel.app
   ```
3. Add **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   ```

## 🔧 Environment Variables

Your app automatically uses these from Supabase info:
- `SUPABASE_URL` - Already configured
- `SUPABASE_ANON_KEY` - Already configured

## 🎯 Testing Social Login

### **Test Flow:**
1. Click "Continue with Google" or "Continue with Facebook"
2. User redirected to provider login
3. After successful login, redirected back to your app
4. User automatically signed in with social profile data

### **Expected User Data:**
```javascript
{
  id: "social-provider-user-id",
  name: "John Doe", // From social profile  
  email: "john@example.com",
  loyaltyPoints: 1250, // Default for social users
  avatar_url: "https://profile-image-url" // From social profile
}
```

## 🚨 Important Notes

⚠️ **Provider Not Enabled Error?**
- Make sure OAuth providers are enabled in Supabase Dashboard
- Verify Client IDs/Secrets are correctly entered
- Check redirect URLs match exactly

⚠️ **Redirect Issues?**
- Ensure Site URL is set to your deployed domain
- Add all possible redirect URLs in provider settings
- Test with deployed app, not localhost

⚠️ **Production Deployment:**
- Social login works best on deployed apps (HTTPS required)
- Update all OAuth redirect URLs after deployment
- Test thoroughly on production domain

## 📱 Features Ready

✅ **Seamless Social Login** - One-click authentication
✅ **Profile Pictures** - Automatically imported from social accounts  
✅ **Name Import** - Real names from Facebook/Google
✅ **Email Verification** - Pre-verified through social providers
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **Error Handling** - Proper error messages and loading states

## 🎉 After Setup

Once configured, your users can:
- Sign up instantly with Google/Facebook
- Skip email verification (already verified by provider)
- Get their real profile pictures and names
- Seamlessly switch between devices
- Enjoy faster checkout experience

## 🆘 Need Help?

**Common Issues:**
- Provider not enabled → Check Supabase dashboard settings
- Redirect errors → Verify URL configuration  
- Invalid client → Double-check credentials

**Documentation:**
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [OAuth Troubleshooting](https://supabase.com/docs/guides/auth/troubleshooting)

---

🌽 **Your Malaysian corn delivery app now has world-class authentication!** 🚀