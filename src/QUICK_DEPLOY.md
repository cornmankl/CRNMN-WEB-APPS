# ⚡ QUICK DEPLOY - THEFMSMKT KE VERCEL

## 🚀 3 Cara Cepat Deploy

### **Method 1: One-Click Script (Termudah!)**
```bash
chmod +x vercel-deploy.sh
./vercel-deploy.sh
```

### **Method 2: Manual Vercel CLI** 
```bash
npm install -g vercel
vercel login
npm run build
vercel --prod
```

### **Method 3: GitHub + Vercel Auto-Deploy**
1. Push ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Deploy otomatis ✅

---

## ⚙️ Environment Variables WAJIB

**Di Vercel Dashboard → Settings → Environment Variables:**

```
VITE_SUPABASE_URL = https://cgdokkeswbskgglyozbd.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZG9ra2Vzd2Jza2dnbHlvemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzU2MjEsImV4cCI6MjA2OTIxMTYyMX0.zqzoFBuBVLCiB_4QWILq_q7XQzJwvuCYRKlMEh-WVxs
NODE_ENV = production
```

---

## 🔧 Supabase Setup Post-Deploy

**Update Site URL di Supabase Dashboard:**
```
https://your-project.vercel.app
```

**Add Redirect URLs:**
```
https://your-project.vercel.app/**
```

---

## ✅ Test Checklist

- [ ] Homepage load ✅
- [ ] Menu 4 flavors ✅  
- [ ] Shopping cart ✅
- [ ] Google/Facebook login ✅
- [ ] Mobile responsive ✅
- [ ] Neon green theme ✅

---

**🌽 Done! Your Malaysian corn delivery app is LIVE! 🇲🇾🚀**