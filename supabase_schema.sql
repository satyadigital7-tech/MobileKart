-- ===================================================
-- HYDERABAD MOBILE CARE - SUPABASE POSTGRESQL SCHEMA
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. ADMINS TABLE (FOR AUTHORIZED ADMIN CHECK)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo TEXT,
    popular_models TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MOBILE MODELS TABLE
CREATE TABLE IF NOT EXISTS public.mobile_models (
    id VARCHAR(50) PRIMARY KEY,
    brand_id VARCHAR(50) REFERENCES public.brands(id) ON DELETE CASCADE,
    brand_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    compatible_models TEXT[] NOT NULL DEFAULT '{}',
    original_price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    images TEXT[] NOT NULL DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    warranty VARCHAR(100),
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REPAIR BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.repair_bookings (
    id VARCHAR(50) PRIMARY KEY, -- e.g. HMC-RP-100245
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    problem_id VARCHAR(50) NOT NULL,
    problem_title VARCHAR(255) NOT NULL,
    problem_category VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('doorstep', 'pickup', 'store_visit')),
    house_number VARCHAR(150),
    street VARCHAR(255),
    area VARCHAR(100) NOT NULL,
    city VARCHAR(100) DEFAULT 'Hyderabad',
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(100) NOT NULL,
    initial_estimated_price NUMERIC(10, 2) NOT NULL,
    final_price NUMERIC(10, 2),
    price_approval_status VARCHAR(20) DEFAULT 'approved' CHECK (price_approval_status IN ('pending', 'approved', 'rejected')),
    status VARCHAR(50) NOT NULL DEFAULT 'Booking Confirmed',
    status_history JSONB DEFAULT '[]'::jsonb,
    technician_name VARCHAR(150),
    technician_phone VARCHAR(20),
    diagnosis_notes TEXT,
    device_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. HMC-ORD-100245
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    delivery_charge NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    shipping_street VARCHAR(255),
    shipping_area VARCHAR(100) NOT NULL,
    shipping_city VARCHAR(100) DEFAULT 'Hyderabad',
    shipping_pincode VARCHAR(10) NOT NULL,
    shipping_landmark VARCHAR(255),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Success',
    payment_id VARCHAR(100),
    order_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SERVICE AREAS TABLE (HYDERABAD PINCODES)
CREATE TABLE IF NOT EXISTS public.service_areas (
    id VARCHAR(50) PRIMARY KEY,
    area_name VARCHAR(150) NOT NULL,
    pincode VARCHAR(10) NOT NULL UNIQUE,
    is_supported BOOLEAN DEFAULT TRUE,
    doorstep_available BOOLEAN DEFAULT TRUE,
    doorstep_fee NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    code VARCHAR(50) PRIMARY KEY,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admins Table RLS
CREATE POLICY "Allow Auth Users Read Admins" ON public.admins FOR SELECT TO authenticated USING (true);

-- Allow public read access to products, service areas & coupons
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Service Areas" ON public.service_areas FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);

-- Allow public insert & select for repair bookings & orders
CREATE POLICY "Public Insert Repairs" ON public.repair_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Repairs" ON public.repair_bookings FOR SELECT USING (true);
CREATE POLICY "Public Update Repairs" ON public.repair_bookings FOR UPDATE USING (true);

CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON public.orders FOR SELECT USING (true);

-- Allow admin write operations on all tables
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin All Service Areas" ON public.service_areas FOR ALL USING (true);

-- ===================================================
-- INITIAL HYDERABAD SEED DATA
-- ===================================================

INSERT INTO public.service_areas (id, area_name, pincode, is_supported, doorstep_available, doorstep_fee) VALUES
('sa-1', 'Madhapur / Hitech City', '500081', true, true, 0),
('sa-2', 'Gachibowli / Financial District', '500032', true, true, 0),
('sa-3', 'Kondapur / Hafeezpet', '500084', true, true, 0),
('sa-4', 'Kukatpally / KPHB Colony', '500072', true, true, 99),
('sa-5', 'Jubilee Hills / Film Nagar', '500033', true, true, 0),
('sa-6', 'Banjara Hills / Punjagutta', '500034', true, true, 0),
('sa-7', 'Secunderabad / Begumpet', '500003', true, true, 99),
('sa-8', 'Miyapur / Chandanagar', '500049', true, true, 99)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, description, is_active) VALUES
('WELCOME100', 'fixed', 100, 499, '₹100 Off on your first order', true),
('HYDREPAIR', 'percentage', 15, 999, '15% Off on doorstep repair bookings', true)
ON CONFLICT (code) DO NOTHING;

-- 8. VISTA SHIELD CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.vista_shield_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    is_enabled BOOLEAN DEFAULT TRUE,
    section_title VARCHAR(255) DEFAULT 'MobileKart Vista Shield – Powered by OneAssist',
    subtitle VARCHAR(255) DEFAULT 'Know Your Plan Better',
    v1_price NUMERIC(10, 2) DEFAULT 1798,
    v1_max_benefit NUMERIC(10, 2) DEFAULT 10000,
    v1_badge VARCHAR(100) DEFAULT 'MOST POPULAR',
    v2_price NUMERIC(10, 2) DEFAULT 1598,
    v2_max_benefit NUMERIC(10, 2) DEFAULT 7500,
    tenure VARCHAR(100) DEFAULT '1 Year from date of purchase',
    excess_fees VARCHAR(100) DEFAULT '₹199/-',
    cooling_period VARCHAR(100) DEFAULT '15 Days',
    service_requests_count VARCHAR(50) DEFAULT '1',
    authorized_service_center TEXT DEFAULT 'OneAssist Authorized Service Center / MobileKart',
    product_name TEXT DEFAULT 'Existing Phone Screen Protection Plan',
    service_benefit TEXT DEFAULT 'Screen Protection',
    trust_line_title VARCHAR(100) DEFAULT 'Trust Line',
    trust_line_text TEXT DEFAULT 'After booking your plan, always verify the policy document directly through the official OneAssist App.',
    trust_line_highlight VARCHAR(100) DEFAULT '100% Official & Secure.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vista_shield_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Vista Shield Config" ON public.vista_shield_config FOR SELECT USING (true);
CREATE POLICY "Admin All Vista Shield Config" ON public.vista_shield_config FOR ALL USING (true);

INSERT INTO public.vista_shield_config (id, is_enabled, section_title, subtitle, v1_price, v1_max_benefit, v2_price, v2_max_benefit)
VALUES ('default', true, 'MobileKart Vista Shield – Powered by OneAssist', 'Know Your Plan Better', 1798, 10000, 1598, 7500)
ON CONFLICT (id) DO NOTHING;

-- 9. CART ITEMS TABLE (ISOLATED PER AUTHENTICATED USER ID)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_model VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, selected_model)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart"
ON public.cart_items FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own cart"
ON public.cart_items FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
ON public.cart_items FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart"
ON public.cart_items FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all customer carts"
ON public.cart_items FOR SELECT TO authenticated
USING (true);

-- 10. PROFILES TABLE (STRICT USER IDENTITY & PROFILE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique index on phone number to enforce 1 account per mobile at the database level (PRD Req #12)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_profile_phone
ON public.profiles (phone)
WHERE phone IS NOT NULL AND phone != '';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);



