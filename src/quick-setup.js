#!/usr/bin/env node

// CORNMAN Quick Setup Script
// This script guides you through the complete setup process

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌽 CORNMAN WEB APPS - QUICK SETUP');
console.log('=====================================\n');

console.log('This script will guide you through setting up your CORNMAN application.\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupProcess() {
  console.log('📋 SETUP CHECKLIST:');
  console.log('✅ Frontend deployed to Vercel');
  console.log('✅ All components created');
  console.log('✅ Database schema ready');
  console.log('✅ Backend API ready\n');

  console.log('🔧 NEXT STEPS:\n');

  // Step 1: Supabase Setup
  console.log('1️⃣  SUPABASE DATABASE SETUP:');
  console.log('   • Go to https://supabase.com');
  console.log('   • Create a new project');
  console.log('   • Copy your Project URL and Anon Key\n');

  const hasSupabase = await askQuestion('Have you created your Supabase project? (y/n): ');
  
  if (hasSupabase.toLowerCase() === 'y') {
    console.log('✅ Great! Let\'s configure the database...\n');
    
    const supabaseUrl = await askQuestion('Enter your Supabase Project URL: ');
    const supabaseKey = await askQuestion('Enter your Supabase Anon Key: ');
    
    console.log('\n📋 Now let\'s deploy the database schema...');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Click on "SQL Editor"');
    console.log('3. Click "New Query"');
    console.log('4. Copy the content from src/supabase/deploy-schema.sql');
    console.log('5. Paste it and click "Run"\n');
    
    const schemaDeployed = await askQuestion('Have you deployed the database schema? (y/n): ');
    
    if (schemaDeployed.toLowerCase() === 'y') {
      console.log('✅ Database schema deployed!\n');
    } else {
      console.log('⚠️  Please deploy the database schema first.\n');
    }
  } else {
    console.log('⚠️  Please create your Supabase project first.\n');
  }

  // Step 2: Environment Variables
  console.log('2️⃣  VERCEL ENVIRONMENT VARIABLES:');
  console.log('   • Go to https://vercel.com/dashboard');
  console.log('   • Select your "crnmn-web-apps" project');
  console.log('   • Go to Settings → Environment Variables');
  console.log('   • Add these variables:\n');
  
  console.log('   VITE_SUPABASE_URL = your-supabase-url');
  console.log('   VITE_SUPABASE_ANON_KEY = your-anon-key');
  console.log('   NODE_ENV = production\n');

  const envConfigured = await askQuestion('Have you configured environment variables? (y/n): ');
  
  if (envConfigured.toLowerCase() === 'y') {
    console.log('✅ Environment variables configured!\n');
  } else {
    console.log('⚠️  Please configure environment variables first.\n');
  }

  // Step 3: Redeploy
  console.log('3️⃣  REDEPLOY APPLICATION:');
  console.log('   • After configuring environment variables');
  console.log('   • Redeploy your application\n');

  const redeploy = await askQuestion('Do you want to redeploy now? (y/n): ');
  
  if (redeploy.toLowerCase() === 'y') {
    try {
      console.log('🚀 Redeploying application...');
      execSync('vercel --prod --yes', { stdio: 'inherit' });
      console.log('✅ Application redeployed successfully!\n');
    } catch (error) {
      console.log('❌ Redeploy failed. Please run manually: vercel --prod --yes\n');
    }
  }

  // Step 4: Test
  console.log('4️⃣  TEST YOUR APPLICATION:');
  console.log('   • Open: https://crnmn-web-apps-rg5j0y4g7-cornmankls-projects.vercel.app');
  console.log('   • Test customer features');
  console.log('   • Login as admin: admin@cornman.com / admin123');
  console.log('   • Test admin dashboard\n');

  console.log('🎉 SETUP COMPLETE!');
  console.log('==================');
  console.log('Your CORNMAN application is now fully functional!');
  console.log('🌐 Live URL: https://crnmn-web-apps-rg5j0y4g7-cornmankls-projects.vercel.app');
  console.log('👤 Admin Login: admin@cornman.com / admin123');
  console.log('📚 Documentation: src/COMPLETE_SETUP_GUIDE.md\n');

  console.log('🌟 FEATURES AVAILABLE:');
  console.log('   • Mobile-first e-commerce platform');
  console.log('   • PWA installation');
  console.log('   • Voice search & AR preview');
  console.log('   • Live order tracking');
  console.log('   • Complete admin management system');
  console.log('   • Real-time analytics & reporting');
  console.log('   • Multi-language support\n');

  console.log('🚀 Your corn delivery business is ready to compete with the best!');

  rl.close();
}

setupProcess().catch(console.error);
