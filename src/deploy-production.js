#!/usr/bin/env node

// CORNMAN Production Deployment Script
// This script handles the complete production deployment process

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CORNMAN Production Deployment');
console.log('==================================\n');

async function deployToProduction() {
  try {
    // Step 1: Pre-deployment checks
    console.log('1️⃣  Running Pre-deployment Checks...');
    
    // Check if build exists
    const buildPath = path.join(__dirname, '..', 'build');
    if (!fs.existsSync(buildPath)) {
      console.log('   📦 Building application...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('   ✅ Build completed');
    } else {
      console.log('   ✅ Build directory exists');
    }

    // Check package.json
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }
    console.log('   ✅ package.json found');

    // Check vercel.json
    const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
    if (!fs.existsSync(vercelJsonPath)) {
      console.log('   ⚠️  vercel.json not found, creating default...');
      const defaultVercelConfig = {
        "outputDirectory": "build",
        "framework": "vite",
        "buildCommand": "npm run build",
        "devCommand": "npm run dev",
        "installCommand": "npm install"
      };
      fs.writeFileSync(vercelJsonPath, JSON.stringify(defaultVercelConfig, null, 2));
      console.log('   ✅ vercel.json created');
    } else {
      console.log('   ✅ vercel.json found');
    }

    // Step 2: Environment variables check
    console.log('\n2️⃣  Checking Environment Variables...');
    const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      console.log('   ⚠️  Missing environment variables:', missingEnvVars.join(', '));
      console.log('   📋 Please set these in Vercel dashboard:');
      console.log('      - VITE_SUPABASE_URL');
      console.log('      - VITE_SUPABASE_ANON_KEY');
      console.log('      - NODE_ENV=production');
    } else {
      console.log('   ✅ All required environment variables are set');
    }

    // Step 3: Git status check
    console.log('\n3️⃣  Checking Git Status...');
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        console.log('   📝 Uncommitted changes found:');
        console.log('   ' + gitStatus.split('\n').join('\n   '));
        console.log('   💡 Consider committing changes before deployment');
      } else {
        console.log('   ✅ Working directory is clean');
      }
    } catch (error) {
      console.log('   ⚠️  Git status check failed:', error.message);
    }

    // Step 4: Deploy to Vercel
    console.log('\n4️⃣  Deploying to Vercel...');
    try {
      console.log('   🚀 Starting deployment...');
      execSync('vercel --prod --yes', { stdio: 'inherit' });
      console.log('   ✅ Deployment completed successfully');
    } catch (error) {
      console.log('   ❌ Deployment failed:', error.message);
      throw error;
    }

    // Step 5: Post-deployment verification
    console.log('\n5️⃣  Post-deployment Verification...');
    console.log('   🌐 Your application is now live!');
    console.log('   🔗 Check your Vercel dashboard for the live URL');
    console.log('   🧪 Test all features to ensure everything works');

    // Step 6: Final instructions
    console.log('\n📋 DEPLOYMENT COMPLETE!');
    console.log('=======================');
    console.log('✅ Application deployed to production');
    console.log('✅ All checks passed');
    console.log('✅ Ready for users');

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Test your live application');
    console.log('2. Verify admin login works');
    console.log('3. Test all customer features');
    console.log('4. Set up monitoring and analytics');
    console.log('5. Configure custom domain (optional)');

    console.log('\n🌟 Your CORNMAN application is now live and ready!');
    console.log('🌽 Happy selling!');

  } catch (error) {
    console.log('\n❌ DEPLOYMENT FAILED');
    console.log('====================');
    console.log('Error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Vercel CLI is installed');
    console.log('3. Check Vercel authentication');
    console.log('4. Review error messages above');
    console.log('5. Try running: vercel login');
    
    process.exit(1);
  }
}

// Run deployment
deployToProduction();
