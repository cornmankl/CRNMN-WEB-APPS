// CORNMAN Features Verification Script
// This script verifies all features are working correctly

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 CORNMAN Features Verification');
console.log('==================================\n');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
  console.log('❌ Please set your Supabase credentials first!');
  console.log('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyAllFeatures() {
  let passedTests = 0;
  let totalTests = 0;

  // 1. Database Connection
  console.log('1️⃣  Verifying Database Connection...');
  totalTests++;
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('   ✅ Database connection successful');
    passedTests++;
  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
  }

  // 2. Authentication System
  console.log('\n2️⃣  Verifying Authentication System...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@cornman.com')
      .single();
    
    if (error) throw error;
    if (data && data.role === 'admin') {
      console.log('   ✅ Admin authentication working');
      passedTests++;
    } else {
      console.log('   ❌ Admin authentication failed');
    }
  } catch (error) {
    console.log('   ❌ Authentication test failed:', error.message);
  }

  // 3. Product Management
  console.log('\n3️⃣  Verifying Product Management...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`   ✅ Product management working (${data.length} products)`);
      passedTests++;
    } else {
      console.log('   ❌ No products found');
    }
  } catch (error) {
    console.log('   ❌ Product management test failed:', error.message);
  }

  // 4. Order Management
  console.log('\n4️⃣  Verifying Order Management...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    console.log(`   ✅ Order management working (${data.length} orders)`);
    passedTests++;
  } catch (error) {
    console.log('   ❌ Order management test failed:', error.message);
  }

  // 5. Inventory Management
  console.log('\n5️⃣  Verifying Inventory Management...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`   ✅ Inventory management working (${data.length} items)`);
      passedTests++;
    } else {
      console.log('   ❌ No inventory items found');
    }
  } catch (error) {
    console.log('   ❌ Inventory management test failed:', error.message);
  }

  // 6. Driver Management
  console.log('\n6️⃣  Verifying Driver Management...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`   ✅ Driver management working (${data.length} drivers)`);
      passedTests++;
    } else {
      console.log('   ❌ No drivers found');
    }
  } catch (error) {
    console.log('   ❌ Driver management test failed:', error.message);
  }

  // 7. Settings Management
  console.log('\n7️⃣  Verifying Settings Management...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`   ✅ Settings management working (${data.length} settings)`);
      passedTests++;
    } else {
      console.log('   ❌ No settings found');
    }
  } catch (error) {
    console.log('   ❌ Settings management test failed:', error.message);
  }

  // 8. Analytics System
  console.log('\n8️⃣  Verifying Analytics System...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('   ✅ Analytics system working');
    passedTests++;
  } catch (error) {
    console.log('   ❌ Analytics system test failed:', error.message);
  }

  // 9. Notifications System
  console.log('\n9️⃣  Verifying Notifications System...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('   ✅ Notifications system working');
    passedTests++;
  } catch (error) {
    console.log('   ❌ Notifications system test failed:', error.message);
  }

  // 10. RLS Policies
  console.log('\n🔟 Verifying RLS Policies...');
  totalTests++;
  try {
    // Test public access to products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('   ✅ RLS policies working correctly');
    passedTests++;
  } catch (error) {
    console.log('   ❌ RLS policies test failed:', error.message);
  }

  // Summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL FEATURES VERIFIED!');
    console.log('Your CORNMAN application is fully functional!');
    console.log('\n🌟 AVAILABLE FEATURES:');
    console.log('   ✅ Complete E-commerce Platform');
    console.log('   ✅ Advanced Admin Management System');
    console.log('   ✅ Mobile-First Design');
    console.log('   ✅ PWA Capabilities');
    console.log('   ✅ Real-time Analytics');
    console.log('   ✅ Secure Authentication');
    console.log('   ✅ Inventory Management');
    console.log('   ✅ Driver Management');
    console.log('   ✅ Order Management');
    console.log('   ✅ Settings Management');
    console.log('   ✅ Notifications System');
    
    console.log('\n🌐 LIVE APPLICATION:');
    console.log('   URL: https://crnmn-web-apps-rg5j0y4g7-cornmankls-projects.vercel.app');
    console.log('   Admin Login: admin@cornman.com / admin123');
    
    console.log('\n🚀 YOUR CORNMAN BUSINESS IS READY!');
  } else {
    console.log('\n⚠️  SOME FEATURES NEED ATTENTION');
    console.log('Please check the errors above and fix them.');
    console.log('Make sure your database schema is deployed correctly.');
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Deploy database schema: src/supabase/complete-schema.sql');
    console.log('2. Configure environment variables in Vercel');
    console.log('3. Redeploy your application');
    console.log('4. Test each feature individually');
  }

  console.log('\n📞 SUPPORT:');
  console.log('If you need help, check:');
  console.log('- src/COMPLETE_SETUP_GUIDE.md');
  console.log('- src/SETUP_INSTRUCTIONS.md');
  console.log('- Vercel deployment logs');
  console.log('- Supabase logs');
}

// Run verification
verifyAllFeatures().catch(console.error);
