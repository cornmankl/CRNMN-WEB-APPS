// CORNMAN Environment Variables Setup
// This script helps you configure environment variables

const fs = require('fs');
const path = require('path');

console.log('🔧 CORNMAN Environment Variables Setup\n');

console.log('📋 Please follow these steps to configure your environment variables:\n');

console.log('1️⃣  SUPABASE SETUP:');
console.log('   • Go to https://supabase.com');
console.log('   • Sign up/Login to your account');
console.log('   • Create a new project');
console.log('   • Go to Settings → API');
console.log('   • Copy your Project URL and Anon Key\n');

console.log('2️⃣  VERCEL ENVIRONMENT VARIABLES:');
console.log('   • Go to https://vercel.com/dashboard');
console.log('   • Select your "crnmn-web-apps" project');
console.log('   • Go to Settings → Environment Variables');
console.log('   • Add these variables:\n');

console.log('   Variable Name: VITE_SUPABASE_URL');
console.log('   Value: https://your-project.supabase.co');
console.log('   Environment: Production, Preview, Development\n');

console.log('   Variable Name: VITE_SUPABASE_ANON_KEY');
console.log('   Value: your-anon-key-here');
console.log('   Environment: Production, Preview, Development\n');

console.log('   Variable Name: NODE_ENV');
console.log('   Value: production');
console.log('   Environment: Production, Preview, Development\n');

console.log('3️⃣  REDEPLOY APPLICATION:');
console.log('   • After adding environment variables, redeploy your app');
console.log('   • Run: vercel --prod --yes');
console.log('   • Or trigger a new deployment from GitHub\n');

console.log('4️⃣  TEST YOUR SETUP:');
console.log('   • Open your live app');
console.log('   • Try to login with admin credentials');
console.log('   • Check if admin dashboard loads\n');

console.log('📞 NEED HELP?');
console.log('   • Check the COMPLETE_SETUP_GUIDE.md file');
console.log('   • All setup instructions are documented there\n');

console.log('🎉 Once configured, your CORNMAN app will be fully functional!');
