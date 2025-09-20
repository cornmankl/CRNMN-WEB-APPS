# 🚀 DEPLOY THEFMSMKT KE VERCEL - PANDUAN CEPAT

## 📝 Langkah-langkah Deployment

### **Option 1: Deploy Otomatis (Termudah) 🎯**

1. **Upload code ke GitHub terlebih dahulu:**
```bash
git add .
git commit -m "🌽 Ready for deployment: THEFMSMKT CORNMAN food delivery app"
git push origin main
```

2. **Kunjungi [vercel.com](https://vercel.com) dan login**

3. **Import dari GitHub:**
   - Klik "New Project"
   - Pilih repository GitHub Anda
   - Klik "Import"

4. **Vercel akan otomatis detect settings:**
   - ✅ Framework: Vite
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`
   - ✅ Install Command: `npm install`

5. **Klik "Deploy"** dan tunggu sekitar 2-3 menit

---

### **Option 2: Deploy Manual dengan CLI 💻**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login ke Vercel:**
```bash
vercel login
```

3. **Deploy langsung:**
```bash
# Build aplikasi terlebih dahulu
npm run build

# Deploy ke Vercel
vercel --prod
```

4. **Ikuti prompts:**
   - Set up project: Y
   - Link to existing project: N
   - Project name: thefmsmkt-cornman
   - Directory: ./
   - Want to override settings: N

---

### **Option 3: Gunakan Script Deployment yang Sudah Ada 🔧**

```bash
# Menggunakan script yang sudah tersedia
chmod +x deploy.sh
./deploy.sh
```

---

## ⚙️ Environment Variables (WAJIB DISET!)

Setelah deployment, tambahkan environment variables di Vercel Dashboard:

### **Go to: Project Settings → Environment Variables**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://cgdokkeswbskgglyozbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZG9ra2Vzd2Jza2dna3lvemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NjU3ODcsImV4cCI6MjA1MjM0MTc4N30.YOUR_ACTUAL_ANON_KEY_HERE

# Production optimizations
NODE_ENV=production
```

⚠️ **PENTING**: Ganti `YOUR_ACTUAL_ANON_KEY_HERE` dengan anon key Supabase yang asli!

---

## 🔧 Konfigurasi Supabase untuk Production

### **1. Update Site URL di Supabase Dashboard:**
```
Site URL: https://your-project-name.vercel.app
```

### **2. Tambahkan Redirect URLs:**
```
https://your-project-name.vercel.app
https://your-project-name.vercel.app/**
https://your-custom-domain.com (jika ada)
```

### **3. OAuth Settings untuk Google & Facebook:**
```
Authorized redirect URIs:
https://cgdokkeswbskgglyozbd.supabase.co/auth/v1/callback
https://your-project-name.vercel.app/auth/callback
```

---

## 🌐 Custom Domain (Opsional)

### **Setelah deploy berhasil:**

1. **Di Vercel Dashboard:**
   - Go to Project → Settings → Domains
   - Add domain: `thefmsmkt.my` atau `cornman.my`

2. **Update DNS Records di domain provider:**
```dns
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

## ✅ Post-Deployment Checklist

### **Test semua fitur:**
- [ ] Homepage loads dengan animasi
- [ ] Menu section menampilkan 4 flavors
- [ ] Shopping cart berfungsi
- [ ] Social authentication (Google/Facebook) works
- [ ] Mobile responsive
- [ ] Loading states proper
- [ ] Neon green theme konsisten

### **Performance Check:**
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Check mobile performance
- [ ] Verify all images loading

---

## 🚨 Troubleshooting

### **Build Fails:**
```bash
# Clear cache dan rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Environment Variables Issues:**
- Pastikan semua env vars menggunakan prefix `VITE_` untuk Vite
- Check di Vercel Dashboard → Settings → Environment Variables
- Redeploy setelah menambah env vars

### **Supabase Connection Issues:**
- Verify Supabase URL dan anon key
- Check CORS settings di Supabase
- Ensure site URL updated di Supabase dashboard

---

## 🎉 Expected Results

### **Setelah deployment berhasil, Anda akan mendapat:**

✅ **Live URL:** `https://your-project-name.vercel.app`  
✅ **Automatic HTTPS** dengan SSL certificate  
✅ **Global CDN** untuk loading cepat di Malaysia  
✅ **Automatic deployments** dari GitHub push  
✅ **Real-time analytics** di Vercel dashboard  

### **Your Malaysian corn delivery app is now LIVE! 🌽🚀**

---

## 📞 Need Help?

**Common Issues:**
- Build errors → Check TypeScript errors: `npx tsc --noEmit`
- 404 errors → Check vercel.json rewrites configuration
- Slow loading → Enable compression in vercel.json

**Vercel Support:**
- [Vercel Documentation](https://vercel.com/docs)
- [Vite + Vercel Guide](https://vercel.com/guides/deploying-vite-with-vercel)

---

**🌽 THEFMSMKT CMNTYPLX siap melayani Malaysia! 🇲🇾**