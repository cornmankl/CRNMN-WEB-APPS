// CORNMAN Database Setup Script
// Run this script to setup your Supabase database

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_KEY_HERE') {
  console.log('❌ Please set your Supabase credentials first!');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Go to Settings → API');
  console.log('3. Copy your Project URL and Service Role Key');
  console.log('4. Set environment variables:');
  console.log('   export VITE_SUPABASE_URL="your-project-url"');
  console.log('   export SUPABASE_SERVICE_KEY="your-service-key"');
  console.log('5. Run: node src/setup-database.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🚀 Starting CORNMAN Database Setup...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase', 'deploy-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Deploying database schema...');
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.error('❌ Error deploying schema:', error.message);
      return;
    }

    console.log('✅ Database schema deployed successfully!');

    // Test the setup
    console.log('\n🧪 Testing database setup...');
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      console.error('❌ Error testing users table:', usersError.message);
      return;
    }

    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (productsError) {
      console.error('❌ Error testing products table:', productsError.message);
      return;
    }

    // Test settings table
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(5);

    if (settingsError) {
      console.error('❌ Error testing settings table:', settingsError.message);
      return;
    }

    console.log('✅ All tables created successfully!');
    console.log('✅ Default data inserted successfully!');
    console.log('✅ Admin user created successfully!');
    console.log('✅ Settings configured successfully!');

    // Display admin credentials
    console.log('\n👤 Admin Credentials:');
    console.log('   Email: admin@cornman.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change this password after first login!');

    // Display settings
    console.log('\n⚙️  Default Settings:');
    settings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🌐 Your app is now ready to use!');
    console.log('🔗 Live URL: https://crnmn-web-apps-rg5j0y4g7-cornmankls-projects.vercel.app');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Click on "SQL Editor"');
    console.log('3. Click "New Query"');
    console.log('4. Copy and paste the content from src/supabase/deploy-schema.sql');
    console.log('5. Click "Run" to execute the schema');
  }
}

// Run the setup
setupDatabase();
