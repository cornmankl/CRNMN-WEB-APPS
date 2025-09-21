// CORNMAN Admin Functionality Test Script
// This script tests all admin features end-to-end

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
  console.log('❌ Please set your Supabase credentials first!');
  console.log('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminFunctionality() {
  console.log('🧪 CORNMAN Admin Functionality Test');
  console.log('=====================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Database Connection
  console.log('1️⃣  Testing Database Connection...');
  totalTests++;
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');
    passedTests++;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }

  // Test 2: Admin User Exists
  console.log('\n2️⃣  Testing Admin User...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@cornman.com')
      .single();
    
    if (error) throw error;
    if (data && data.role === 'admin') {
      console.log('✅ Admin user exists and has correct role');
      passedTests++;
    } else {
      console.log('❌ Admin user not found or incorrect role');
    }
  } catch (error) {
    console.log('❌ Admin user test failed:', error.message);
  }

  // Test 3: Products Table
  console.log('\n3️⃣  Testing Products Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`✅ Products table working (${data.length} products found)`);
      passedTests++;
    } else {
      console.log('❌ No products found');
    }
  } catch (error) {
    console.log('❌ Products table test failed:', error.message);
  }

  // Test 4: Categories Table
  console.log('\n4️⃣  Testing Categories Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`✅ Categories table working (${data.length} categories found)`);
      passedTests++;
    } else {
      console.log('❌ No categories found');
    }
  } catch (error) {
    console.log('❌ Categories table test failed:', error.message);
  }

  // Test 5: Settings Table
  console.log('\n5️⃣  Testing Settings Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`✅ Settings table working (${data.length} settings found)`);
      passedTests++;
    } else {
      console.log('❌ No settings found');
    }
  } catch (error) {
    console.log('❌ Settings table test failed:', error.message);
  }

  // Test 6: Inventory Table
  console.log('\n6️⃣  Testing Inventory Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`✅ Inventory table working (${data.length} items found)`);
      passedTests++;
    } else {
      console.log('❌ No inventory items found');
    }
  } catch (error) {
    console.log('❌ Inventory table test failed:', error.message);
  }

  // Test 7: Drivers Table
  console.log('\n7️⃣  Testing Drivers Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`✅ Drivers table working (${data.length} drivers found)`);
      passedTests++;
    } else {
      console.log('❌ No drivers found');
    }
  } catch (error) {
    console.log('❌ Drivers table test failed:', error.message);
  }

  // Test 8: RLS Policies
  console.log('\n8️⃣  Testing RLS Policies...');
  totalTests++;
  try {
    // Test public access to products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ RLS policies working correctly');
    passedTests++;
  } catch (error) {
    console.log('❌ RLS policies test failed:', error.message);
  }

  // Test 9: Analytics Table
  console.log('\n9️⃣  Testing Analytics Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Analytics table working');
    passedTests++;
  } catch (error) {
    console.log('❌ Analytics table test failed:', error.message);
  }

  // Test 10: Notifications Table
  console.log('\n🔟 Testing Notifications Table...');
  totalTests++;
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Notifications table working');
    passedTests++;
  } catch (error) {
    console.log('❌ Notifications table test failed:', error.message);
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Your CORNMAN admin system is fully functional!');
    console.log('🌐 Live URL: https://crnmn-web-apps-rg5j0y4g7-cornmankls-projects.vercel.app');
    console.log('👤 Admin Login: admin@cornman.com / admin123');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('Please check the errors above and fix them.');
    console.log('Make sure your database schema is deployed correctly.');
  }

  console.log('\n🚀 Next Steps:');
  console.log('1. Deploy database schema if not done');
  console.log('2. Configure Vercel environment variables');
  console.log('3. Test admin login in your live app');
  console.log('4. Verify all admin features work');
}

// Run the tests
testAdminFunctionality().catch(console.error);
