-- CORNMAN Complete Database Schema
-- This is the final, production-ready database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'driver', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status AS ENUM ('assigned', 'picked_up', 'in_transit', 'delivered', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('order_update', 'promotion', 'system', 'delivery', 'payment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    image_url TEXT,
    images JSONB DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_address JSONB NOT NULL,
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(100),
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    license_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    vehicle_model VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    current_location JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    driver_id UUID REFERENCES drivers(id),
    status delivery_status DEFAULT 'assigned',
    location JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    current_stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2) DEFAULT 0,
    supplier VARCHAR(200),
    sku VARCHAR(50),
    location VARCHAR(100),
    last_restocked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_driver_id ON delivery_tracking(driver_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_drivers_updated_at ON drivers;
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO categories (name, description, is_active, sort_order) VALUES
('Classic', 'Traditional corn varieties', TRUE, 1),
('Dessert', 'Sweet corn treats', TRUE, 2),
('Traditional', 'Authentic Malaysian corn', TRUE, 3),
('Premium', 'Special corn varieties', TRUE, 4)
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, category_id, is_available, is_featured) VALUES
('CORNMAN Classic Cup', 'Our signature corn cup with traditional recipe', 7.90, (SELECT id FROM categories WHERE name = 'Classic'), TRUE, TRUE),
('Chocolate Delight', 'Sweet corn with chocolate sauce', 9.50, (SELECT id FROM categories WHERE name = 'Dessert'), TRUE, TRUE),
('Susu Pekat Classic', 'Traditional corn with condensed milk', 8.50, (SELECT id FROM categories WHERE name = 'Traditional'), TRUE, TRUE),
('Premium Corn Special', 'Premium corn with special ingredients', 12.90, (SELECT id FROM categories WHERE name = 'Premium'), TRUE, FALSE),
('Spicy Corn Delight', 'Spicy corn with chili sauce', 10.50, (SELECT id FROM categories WHERE name = 'Traditional'), TRUE, FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO settings (key, value, description, is_public) VALUES
('business_name', '"CORNMAN"', 'Business name', TRUE),
('business_phone', '"+60123456789"', 'Business phone number', TRUE),
('business_email', '"info@cornman.com"', 'Business email', TRUE),
('business_address', '"123 Jalan Corn, Kuala Lumpur"', 'Business address', TRUE),
('delivery_fee', '2.50', 'Standard delivery fee', TRUE),
('min_order_amount', '15.00', 'Minimum order amount', TRUE),
('delivery_zones', '["Kuala Lumpur", "Ampang", "Puchong", "Subang", "Petaling Jaya"]', 'Available delivery zones', TRUE),
('payment_methods', '["cash", "card", "online", "ewallet"]', 'Accepted payment methods', TRUE),
('operating_hours', '{"start": "10:00", "end": "22:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}', 'Business operating hours', TRUE),
('currency', '"MYR"', 'Business currency', TRUE),
('timezone', '"Asia/Kuala_Lumpur"', 'Business timezone', TRUE),
('max_delivery_time', '45', 'Maximum delivery time in minutes', TRUE),
('free_delivery_threshold', '50.00', 'Free delivery threshold', TRUE),
('tax_rate', '6.00', 'Tax rate percentage', TRUE),
('app_version', '"1.0.0"', 'Application version', TRUE)
ON CONFLICT (key) DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES
('admin@cornman.com', crypt('admin123', gen_salt('bf')), 'admin', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, first_name, last_name, phone) VALUES
((SELECT id FROM users WHERE email = 'admin@cornman.com'), 'Admin', 'User', '+60123456789')
ON CONFLICT (user_id) DO NOTHING;

-- Create sample driver
INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES
('driver@cornman.com', crypt('driver123', gen_salt('bf')), 'driver', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, first_name, last_name, phone) VALUES
((SELECT id FROM users WHERE email = 'driver@cornman.com'), 'Ali', 'Hassan', '+60123456788')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO drivers (user_id, license_number, vehicle_type, vehicle_number, vehicle_model, is_verified, is_available, rating, total_deliveries) VALUES
((SELECT id FROM users WHERE email = 'driver@cornman.com'), 'D1234567', 'motorcycle', 'ABC1234', 'Honda Wave 125', TRUE, TRUE, 4.8, 0)
ON CONFLICT (license_number) DO NOTHING;

-- Create sample customer
INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES
('customer@cornman.com', crypt('customer123', gen_salt('bf')), 'customer', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, first_name, last_name, phone) VALUES
((SELECT id FROM users WHERE email = 'customer@cornman.com'), 'Ahmad', 'Rahman', '+60198765432')
ON CONFLICT (user_id) DO NOTHING;

-- Insert inventory data
INSERT INTO inventory (product_id, current_stock, min_stock, max_stock, reorder_point, unit_cost, supplier, sku, location) VALUES
((SELECT id FROM products WHERE name = 'CORNMAN Classic Cup'), 50, 10, 100, 20, 3.50, 'Fresh Corn Supplier', 'CC-001', 'A-01-01'),
((SELECT id FROM products WHERE name = 'Chocolate Delight'), 30, 5, 80, 15, 4.20, 'Chocolate Co.', 'CD-001', 'A-01-02'),
((SELECT id FROM products WHERE name = 'Susu Pekat Classic'), 25, 8, 60, 12, 2.80, 'Traditional Foods Ltd', 'SPC-001', 'A-02-01'),
((SELECT id FROM products WHERE name = 'Premium Corn Special'), 15, 5, 50, 10, 6.50, 'Premium Supplier', 'PCS-001', 'A-02-02'),
((SELECT id FROM products WHERE name = 'Spicy Corn Delight'), 20, 5, 40, 8, 4.80, 'Spice Supplier', 'SCD-001', 'A-03-01')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (auth.uid() = (SELECT user_id FROM orders WHERE id = order_id));

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = (SELECT user_id FROM orders WHERE id = order_id));

DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
CREATE POLICY "Users can create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
DROP POLICY IF EXISTS "Admins can view all data" ON users;
CREATE POLICY "Admins can view all data" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
CREATE POLICY "Admins can view all reviews" ON reviews FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications" ON notifications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public read access for products and categories
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (is_public = true);

COMMIT;
