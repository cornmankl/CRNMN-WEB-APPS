# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

## **📋 REQUIRED ENVIRONMENT VARIABLES**

Your CORNMAN application needs these environment variables to function properly:

### **🌐 Supabase Configuration**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **⚙️ Application Configuration**
```
NODE_ENV=production
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=CORNMAN
```

## **🚀 HOW TO SETUP**

### **Step 1: Get Supabase Credentials**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon Key** (public key)

### **Step 2: Add to Vercel**
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `crnmn-web-apps` project
3. Click "Settings" → "Environment Variables"
4. Add each variable:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project.supabase.co`
   - **Environment:** Production, Preview, Development
   
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `your-anon-key-here`
   - **Environment:** Production, Preview, Development
   
   - **Name:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Production, Preview, Development

### **Step 3: Redeploy**
After adding environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on latest deployment
3. Or push new commit to trigger deployment

## **✅ VERIFICATION**

After setup, your app should:
- ✅ Load without errors
- ✅ Connect to Supabase database
- ✅ Admin login should work
- ✅ All features should function

## **🔍 TROUBLESHOOTING**

### **If app shows errors:**
1. Check environment variables are correct
2. Verify Supabase project is active
3. Check Vercel deployment logs
4. Ensure database schema is deployed

### **If admin login fails:**
1. Verify database schema is deployed
2. Check if admin user exists
3. Verify RLS policies are correct

## **📞 SUPPORT**

If you need help:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify all steps are completed
4. Test each feature individually

**Your CORNMAN app will be fully functional after this setup!** 🌽✨
