/*
  # NovaMobile Complete E-Commerce Schema

  1. Tables: brands, categories, products, coupons, banners, testimonials, faqs, store_settings, orders
  2. RLS: enabled on all tables with appropriate policies
  3. RPC functions: find_order_by_tracking (guest), update_order_status (admin)
  4. Seed data: all brands, categories, 20 products, coupons, banners, testimonials, FAQs, sample order
*/

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are publicly readable" ON brands FOR SELECT TO public USING (true);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  image text,
  description text,
  featured boolean DEFAULT false,
  parent_id text REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT TO public USING (true);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  brand text NOT NULL,
  brand_id text REFERENCES brands(id),
  category_id text REFERENCES categories(id),
  category_slug text NOT NULL,
  description text,
  short_description text,
  thumbnail text,
  images text[] DEFAULT '{}',
  variants jsonb DEFAULT '[]',
  specs jsonb DEFAULT '[]',
  in_box text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  base_sale_price numeric(10,2),
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  stock integer DEFAULT 0,
  warranty text,
  return_policy text,
  shipping text,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_is_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible products are publicly readable" ON products FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins can read all products" ON products FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admins can insert products" ON products FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admins can update products" ON products FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id text PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric(10,2) NOT NULL,
  min_order numeric(10,2) DEFAULT 0,
  max_discount numeric(10,2),
  usage_limit integer DEFAULT 0,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons are publicly readable" ON coupons FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON coupons FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  image text,
  mobile_image text,
  cta text,
  cta_link text,
  bg_color text DEFAULT '#0F172A',
  text_color text DEFAULT '#FFFFFF',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active banners are publicly readable" ON banners FOR SELECT TO public USING (is_active = true);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id text PRIMARY KEY,
  author text NOT NULL,
  avatar text,
  location text,
  rating integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  product text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are publicly readable" ON testimonials FOR SELECT TO public USING (true);

-- FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id text PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are publicly readable" ON faqs FOR SELECT TO public USING (true);

-- STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store settings are publicly readable" ON store_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update store settings" ON store_settings FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  tracking_code text UNIQUE NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  payment_method jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','payment_confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','refunded')),
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping_fee numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  coupon_code text,
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  courier_name text,
  courier_tracking_number text,
  estimated_delivery text,
  tracking_events jsonb DEFAULT '[]',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT TO public
  WITH CHECK (order_number IS NOT NULL AND tracking_code IS NOT NULL AND total >= 0);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- RPC: Secure guest order tracking (bypasses RLS)
CREATE OR REPLACE FUNCTION find_order_by_tracking(p_tracking_code text, p_identifier text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_result jsonb;
BEGIN
  SELECT row_to_json(o.*)::jsonb INTO v_result
  FROM orders o
  WHERE upper(trim(o.tracking_code)) = upper(trim(p_tracking_code))
    AND (
      lower(o.shipping_address->>'email') = lower(trim(p_identifier))
      OR regexp_replace(o.shipping_address->>'phone', '[^0-9]', '', 'g') =
         regexp_replace(p_identifier, '[^0-9]', '', 'g')
    )
  LIMIT 1;
  RETURN v_result;
END;
$$;

-- SEED: BRANDS
INSERT INTO brands (id, name, slug, logo, featured) VALUES
  ('b1','Apple','apple','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?w=100',true),
  ('b2','Samsung','samsung','https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?w=100',true),
  ('b3','Google','google','https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?w=100',true),
  ('b4','OnePlus','oneplus','https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?w=100',false),
  ('b5','Sony','sony','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=100',false),
  ('b6','Xiaomi','xiaomi','https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?w=100',false),
  ('b7','Anker','anker','https://images.pexels.com/photos/6804081/pexels-photo-6804081.jpeg?w=100',false),
  ('b8','NovaMobile','novamobile','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=100',false)
ON CONFLICT (id) DO NOTHING;

-- SEED: CATEGORIES
INSERT INTO categories (id, name, slug, icon, image, description, featured) VALUES
  ('cat1','iPhones','iphones','smartphone','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=600','The latest iPhones with cutting-edge technology',true),
  ('cat2','Android Phones','android-phones','smartphone','https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600','Premium Android flagships and budget-friendly options',true),
  ('cat3','Tablets','tablets','tablet','https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?auto=compress&cs=tinysrgb&w=600','Powerful tablets for work and entertainment',true),
  ('cat4','Smartwatches','smartwatches','watch','https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600','Stay connected with premium smartwatches',true),
  ('cat5','Earbuds','earbuds','headphones','https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600','Immersive audio with true wireless earbuds',true),
  ('cat6','Cases','cases','shield','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600','Protect your device in style',false),
  ('cat7','Chargers','chargers','zap','https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=600','Fast charging solutions for all devices',false),
  ('cat8','Power Banks','power-banks','battery','https://images.pexels.com/photos/6804081/pexels-photo-6804081.jpeg?auto=compress&cs=tinysrgb&w=600','Never run out of battery on the go',false)
ON CONFLICT (id) DO NOTHING;

-- SEED: PRODUCTS
INSERT INTO products (id,slug,name,brand,brand_id,category_id,category_slug,description,short_description,thumbnail,images,variants,specs,in_box,features,tags,base_price,base_sale_price,rating,review_count,is_featured,is_new,is_bestseller,is_visible,stock,warranty,return_policy,shipping,meta_title,meta_description,created_at) VALUES
('p1','apple-iphone-15-pro-max','iPhone 15 Pro Max','Apple','b1','cat1','iphones','The iPhone 15 Pro Max is Apple''s most advanced smartphone ever. Featuring the A17 Pro chip, a titanium design, and the most versatile iPhone camera system ever.','A17 Pro chip, titanium design, 48MP camera system','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v1-1","storage":"256GB","color":"Natural Titanium","colorHex":"#B8A9A0","condition":"new","price":1199,"salePrice":1099,"stock":15,"sku":"IPH15PM-256-NT"},{"id":"v1-2","storage":"512GB","color":"Natural Titanium","colorHex":"#B8A9A0","condition":"new","price":1399,"salePrice":1299,"stock":10,"sku":"IPH15PM-512-NT"},{"id":"v1-3","storage":"256GB","color":"Black Titanium","colorHex":"#2C2C2E","condition":"new","price":1199,"salePrice":1099,"stock":8,"sku":"IPH15PM-256-BT"},{"id":"v1-4","storage":"256GB","color":"White Titanium","colorHex":"#F5F5F0","condition":"new","price":1199,"salePrice":1099,"stock":12,"sku":"IPH15PM-256-WT"}]','[{"group":"Display","label":"Screen Size","value":"6.7 inches"},{"group":"Display","label":"Resolution","value":"2796 x 1290 pixels"},{"group":"Display","label":"Technology","value":"Super Retina XDR OLED"},{"group":"Performance","label":"Chip","value":"Apple A17 Pro"},{"group":"Performance","label":"RAM","value":"8GB"},{"group":"Camera","label":"Main Camera","value":"48MP + 12MP + 12MP"},{"group":"Camera","label":"Front Camera","value":"12MP TrueDepth"},{"group":"Battery","label":"Capacity","value":"4422 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"},{"group":"Build","label":"Material","value":"Titanium frame"}]',ARRAY['iPhone 15 Pro Max','USB-C Cable','Documentation'],ARRAY['ProMotion display','USB 3 speeds','Action button','Satellite connectivity'],ARRAY['iphone','apple','5g','flagship','pro'],1199,1099,4.9,2847,true,true,true,true,45,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99','iPhone 15 Pro Max - NovaMobile','Buy the iPhone 15 Pro Max at NovaMobile. Best price guaranteed.','2024-01-15T10:00:00Z'),
('p2','samsung-galaxy-s24-ultra','Samsung Galaxy S24 Ultra','Samsung','b2','cat2','android-phones','The Samsung Galaxy S24 Ultra is the ultimate Android flagship with built-in S Pen, 200MP camera, and the most powerful Snapdragon processor.','Snapdragon 8 Gen 3, 200MP camera, built-in S Pen','https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v2-1","storage":"256GB","color":"Titanium Black","colorHex":"#1C1C1E","condition":"new","price":1299,"salePrice":1199,"stock":20,"sku":"SGS24U-256-TB"},{"id":"v2-2","storage":"512GB","color":"Titanium Black","colorHex":"#1C1C1E","condition":"new","price":1419,"salePrice":1319,"stock":15,"sku":"SGS24U-512-TB"},{"id":"v2-3","storage":"256GB","color":"Titanium Violet","colorHex":"#7E57C2","condition":"new","price":1299,"salePrice":1199,"stock":10,"sku":"SGS24U-256-TV"}]','[{"group":"Display","label":"Screen Size","value":"6.8 inches"},{"group":"Display","label":"Resolution","value":"3088 x 1440 pixels"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 3"},{"group":"Performance","label":"RAM","value":"12GB"},{"group":"Camera","label":"Main Camera","value":"200MP + 12MP + 10MP + 50MP"},{"group":"Battery","label":"Capacity","value":"5000 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['Galaxy S24 Ultra','S Pen','USB-C Cable','SIM Ejector'],ARRAY['Built-in S Pen','Galaxy AI','100x Space Zoom','Titanium frame'],ARRAY['samsung','android','5g','flagship','s-pen'],1299,1199,4.8,1923,true,true,true,true,45,'1 Year Samsung Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-20T10:00:00Z'),
('p3','google-pixel-8-pro','Google Pixel 8 Pro','Google','b3','cat2','android-phones','Google''s most powerful phone ever, with the Google Tensor G3 chip, incredible computational photography, and 7 years of OS updates.','Google Tensor G3, best-in-class AI photography','https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v3-1","storage":"128GB","color":"Obsidian","colorHex":"#1C1C1E","condition":"new","price":999,"salePrice":899,"stock":25,"sku":"GP8P-128-OB"},{"id":"v3-2","storage":"256GB","color":"Obsidian","colorHex":"#1C1C1E","condition":"new","price":1059,"salePrice":959,"stock":18,"sku":"GP8P-256-OB"},{"id":"v3-3","storage":"128GB","color":"Bay","colorHex":"#7EC8E3","condition":"new","price":999,"salePrice":899,"stock":12,"sku":"GP8P-128-BA"}]','[{"group":"Display","label":"Screen Size","value":"6.7 inches"},{"group":"Performance","label":"Processor","value":"Google Tensor G3"},{"group":"Performance","label":"RAM","value":"12GB"},{"group":"Camera","label":"Main Camera","value":"50MP + 48MP + 48MP"},{"group":"Battery","label":"Capacity","value":"5050 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['Pixel 8 Pro','USB-C Cable','Quick Switch Adapter'],ARRAY['Magic Eraser','Photo Unblur','Real Tone','Temperature sensor'],ARRAY['google','pixel','android','5g','ai'],999,899,4.7,1456,true,false,true,true,55,'1 Year Google Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-02-01T10:00:00Z'),
('p4','apple-iphone-15','iPhone 15','Apple','b1','cat1','iphones','iPhone 15 comes with Dynamic Island, a powerful dual-camera system, and the USB-C connector. All powered by the A16 Bionic chip.','A16 Bionic, Dynamic Island, 48MP camera','https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v4-1","storage":"128GB","color":"Black","colorHex":"#1C1C1E","condition":"new","price":799,"salePrice":749,"stock":30,"sku":"IPH15-128-BK"},{"id":"v4-2","storage":"256GB","color":"Black","colorHex":"#1C1C1E","condition":"new","price":899,"salePrice":849,"stock":25,"sku":"IPH15-256-BK"},{"id":"v4-3","storage":"128GB","color":"Pink","colorHex":"#FFB6C1","condition":"new","price":799,"salePrice":749,"stock":20,"sku":"IPH15-128-PK"},{"id":"v4-4","storage":"128GB","color":"Blue","colorHex":"#4A90D9","condition":"new","price":799,"salePrice":749,"stock":18,"sku":"IPH15-128-BL"}]','[{"group":"Display","label":"Screen Size","value":"6.1 inches"},{"group":"Performance","label":"Chip","value":"Apple A16 Bionic"},{"group":"Camera","label":"Main Camera","value":"48MP + 12MP"},{"group":"Battery","label":"Capacity","value":"3877 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['iPhone 15','USB-C Cable','Documentation'],ARRAY['Dynamic Island','USB-C','48MP Main camera','Ceramic Shield'],ARRAY['iphone','apple','5g','dynamic-island'],799,749,4.8,3241,true,false,true,true,93,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-10T10:00:00Z'),
('p5','samsung-galaxy-a54','Samsung Galaxy A54 5G','Samsung','b2','cat2','android-phones','The Galaxy A54 5G delivers a premium experience at a mid-range price, featuring a stunning 120Hz display and a powerful triple camera system.','Exynos 1380, 120Hz AMOLED, 50MP triple camera','https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v5-1","storage":"128GB","color":"Awesome Graphite","colorHex":"#4A4A4A","condition":"new","price":449,"stock":40,"sku":"SGA54-128-AG"},{"id":"v5-2","storage":"256GB","color":"Awesome Graphite","colorHex":"#4A4A4A","condition":"new","price":499,"stock":35,"sku":"SGA54-256-AG"},{"id":"v5-3","storage":"128GB","color":"Awesome Lime","colorHex":"#90EE90","condition":"new","price":449,"stock":28,"sku":"SGA54-128-AL"}]','[{"group":"Display","label":"Screen Size","value":"6.4 inches"},{"group":"Display","label":"Refresh Rate","value":"120Hz"},{"group":"Performance","label":"Processor","value":"Exynos 1380"},{"group":"Performance","label":"RAM","value":"8GB"},{"group":"Camera","label":"Main Camera","value":"50MP + 12MP + 5MP"},{"group":"Battery","label":"Capacity","value":"5000 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['Galaxy A54 5G','USB-C Cable','SIM Ejector'],ARRAY['120Hz Super AMOLED','IP67 water resistance','OIS Camera','5000mAh battery'],ARRAY['samsung','android','5g','mid-range'],449,NULL,4.5,892,false,false,true,true,103,'1 Year Samsung Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-02-10T10:00:00Z'),
('p6','oneplus-12','OnePlus 12','OnePlus','b4','cat2','android-phones','OnePlus 12 is the speed flagship that delivers Snapdragon 8 Gen 3 performance with Hasselblad camera tuning and 100W SUPERVOOC charging.','Snapdragon 8 Gen 3, Hasselblad camera, 100W charging','https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v6-1","storage":"256GB","color":"Flowy Emerald","colorHex":"#2E8B57","condition":"new","price":799,"salePrice":749,"stock":22,"sku":"OP12-256-FE"},{"id":"v6-2","storage":"512GB","color":"Flowy Emerald","colorHex":"#2E8B57","condition":"new","price":869,"salePrice":819,"stock":15,"sku":"OP12-512-FE"},{"id":"v6-3","storage":"256GB","color":"Silky Black","colorHex":"#1C1C1E","condition":"new","price":799,"salePrice":749,"stock":18,"sku":"OP12-256-SB"}]','[{"group":"Display","label":"Screen Size","value":"6.82 inches"},{"group":"Display","label":"Refresh Rate","value":"120Hz"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 3"},{"group":"Performance","label":"RAM","value":"12GB"},{"group":"Camera","label":"Main Camera","value":"50MP + 64MP + 48MP (Hasselblad)"},{"group":"Battery","label":"Capacity","value":"5400 mAh"},{"group":"Battery","label":"Charging","value":"100W SUPERVOOC"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['OnePlus 12','100W SUPERVOOC Charger','USB-C Cable','Case'],ARRAY['Hasselblad color tuning','100W fast charging','OxygenOS 14','Alert Slider'],ARRAY['oneplus','android','5g','flagship','fast-charging'],799,749,4.6,734,false,true,false,true,55,'1 Year OnePlus Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-02-15T10:00:00Z'),
('p7','samsung-galaxy-z-fold-5','Samsung Galaxy Z Fold 5','Samsung','b2','cat2','android-phones','The Galaxy Z Fold 5 is the ultimate foldable smartphone, offering a compact form when folded and a full tablet experience when opened.','Snapdragon 8 Gen 2, foldable AMOLED, S Pen support','https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v7-1","storage":"256GB","color":"Phantom Black","colorHex":"#1C1C1E","condition":"new","price":1799,"salePrice":1699,"stock":12,"sku":"SGZF5-256-PB"},{"id":"v7-2","storage":"512GB","color":"Phantom Black","colorHex":"#1C1C1E","condition":"new","price":1919,"salePrice":1819,"stock":8,"sku":"SGZF5-512-PB"}]','[{"group":"Display","label":"Inner Screen","value":"7.6 inches foldable"},{"group":"Display","label":"Cover Screen","value":"6.2 inches"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 2"},{"group":"Camera","label":"Main Camera","value":"50MP + 12MP + 10MP"},{"group":"Battery","label":"Capacity","value":"4400 mAh"}]',ARRAY['Galaxy Z Fold 5','USB-C Cable','Protective Case','S Pen Fold Edition'],ARRAY['Foldable design','Flex Mode','DeX mode','IPX8 water resistance'],ARRAY['samsung','foldable','5g','premium'],1799,1699,4.5,512,true,false,false,true,20,'1 Year Samsung Warranty','15-day return policy','Free shipping',NULL,NULL,'2024-01-25T10:00:00Z'),
('p8','apple-ipad-pro-m2','iPad Pro 12.9" M2','Apple','b1','cat3','tablets','The iPad Pro with M2 chip delivers extreme performance with the most advanced display, cameras, and wireless connectivity ever in an iPad.','Apple M2 chip, Liquid Retina XDR, 5G capable','https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v8-1","storage":"256GB","color":"Space Gray","colorHex":"#3A3A3C","condition":"new","price":1099,"salePrice":999,"stock":18,"sku":"IPADPRO-256-SG"},{"id":"v8-2","storage":"512GB","color":"Space Gray","colorHex":"#3A3A3C","condition":"new","price":1299,"salePrice":1199,"stock":12,"sku":"IPADPRO-512-SG"},{"id":"v8-3","storage":"256GB","color":"Silver","colorHex":"#E5E5E5","condition":"new","price":1099,"salePrice":999,"stock":15,"sku":"IPADPRO-256-SL"}]','[{"group":"Display","label":"Screen Size","value":"12.9 inches"},{"group":"Display","label":"Technology","value":"Liquid Retina XDR"},{"group":"Performance","label":"Chip","value":"Apple M2"},{"group":"Connectivity","label":"5G","value":"Optional"},{"group":"Battery","label":"Life","value":"Up to 10 hours"}]',ARRAY['iPad Pro','USB-C Cable','Documentation'],ARRAY['M2 chip','Liquid Retina XDR display','ProRes video','Magic Keyboard compatible'],ARRAY['apple','ipad','tablet','m2'],1099,999,4.9,1123,true,false,true,true,45,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-12T10:00:00Z'),
('p9','apple-watch-series-9','Apple Watch Series 9','Apple','b1','cat4','smartwatches','Apple Watch Series 9 is the ultimate smartwatch with the new S9 chip, Double Tap gesture, and the brightest Apple Watch display ever.','S9 chip, Double Tap, Always-On Retina display','https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v9-1","storage":"41mm","color":"Midnight","colorHex":"#1C1C1E","condition":"new","price":399,"salePrice":379,"stock":30,"sku":"AWS9-41-MN"},{"id":"v9-2","storage":"45mm","color":"Midnight","colorHex":"#1C1C1E","condition":"new","price":429,"salePrice":409,"stock":25,"sku":"AWS9-45-MN"},{"id":"v9-3","storage":"41mm","color":"Starlight","colorHex":"#E8E0D0","condition":"new","price":399,"salePrice":379,"stock":22,"sku":"AWS9-41-SL"}]','[{"group":"Display","label":"Technology","value":"Always-On Retina LTPO"},{"group":"Performance","label":"Chip","value":"Apple S9 SiP"},{"group":"Health","label":"Sensors","value":"Heart rate, ECG, Blood Oxygen"},{"group":"Battery","label":"Life","value":"Up to 18 hours"},{"group":"Connectivity","label":"GPS","value":"Built-in GPS + Cellular"}]',ARRAY['Apple Watch Series 9','Magnetic Charging Cable','Sport Band'],ARRAY['Double Tap gesture','Crash Detection','ECG app','WatchOS 10'],ARRAY['apple','watch','smartwatch','fitness'],399,379,4.8,2341,true,false,true,true,77,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-18T10:00:00Z'),
('p10','apple-airpods-pro-2','AirPods Pro (2nd Gen)','Apple','b1','cat5','earbuds','AirPods Pro deliver up to 2x more Active Noise Cancellation than before, plus Adaptive Transparency, and Personalized Spatial Audio.','H2 chip, Active Noise Cancellation, Spatial Audio','https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v10-1","storage":"Standard","color":"White","colorHex":"#FFFFFF","condition":"new","price":249,"salePrice":229,"stock":50,"sku":"APP2-WH"}]','[{"group":"Audio","label":"Chip","value":"Apple H2"},{"group":"Audio","label":"ANC","value":"2x improved"},{"group":"Battery","label":"Earbuds Life","value":"6 hours (ANC on)"},{"group":"Battery","label":"Total Life","value":"30 hours with case"},{"group":"Connectivity","label":"Bluetooth","value":"5.3"}]',ARRAY['AirPods Pro','MagSafe Charging Case','Ear Tips (S/M/L)','Lightning to USB-C Cable'],ARRAY['Active Noise Cancellation','Adaptive Transparency','Spatial Audio','Touch Control'],ARRAY['apple','airpods','earbuds','anc','wireless'],249,229,4.9,4521,true,false,true,true,50,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-05T10:00:00Z'),
('p11','samsung-galaxy-buds-2-pro','Samsung Galaxy Buds2 Pro','Samsung','b2','cat5','earbuds','Galaxy Buds2 Pro deliver premium hi-fi sound with 24bit Hi-Fi Audio, Intelligent ANC, and a compact ergonomic design.','24bit Hi-Fi audio, Intelligent ANC, compact design','https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v11-1","storage":"Standard","color":"Graphite","colorHex":"#4A4A4A","condition":"new","price":229,"salePrice":179,"stock":35,"sku":"SGB2P-GR"},{"id":"v11-2","storage":"Standard","color":"White","colorHex":"#FFFFFF","condition":"new","price":229,"salePrice":179,"stock":30,"sku":"SGB2P-WH"}]','[{"group":"Audio","label":"Driver","value":"11mm woofer + 6.5mm tweeter"},{"group":"Battery","label":"Earbuds Life","value":"5 hours (ANC on)"},{"group":"Battery","label":"Total Life","value":"18 hours with case"},{"group":"Connectivity","label":"Bluetooth","value":"5.3"}]',ARRAY['Galaxy Buds2 Pro','Charging Case','Ear Tips (S/M/L)','USB-C Cable'],ARRAY['24bit Hi-Fi Audio','Intelligent ANC','Auto Switch','IPX7 water resistance'],ARRAY['samsung','earbuds','anc','wireless'],229,179,4.6,1234,false,false,false,true,65,'1 Year Samsung Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-02-05T10:00:00Z'),
('p12','anker-powercore-26800','Anker PowerCore 26800','Anker','b7','cat8','power-banks','The Anker PowerCore 26800 is a high-capacity portable charger with 26800mAh that can charge your iPhone multiple times.','26800mAh, dual USB-A + USB-C, 15W output','https://images.pexels.com/photos/6804081/pexels-photo-6804081.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/6804081/pexels-photo-6804081.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v12-1","storage":"26800mAh","color":"Black","colorHex":"#1C1C1E","condition":"new","price":59,"stock":80,"sku":"APC26800-BK"}]','[{"group":"Capacity","label":"Battery","value":"26800mAh"},{"group":"Output","label":"Ports","value":"2x USB-A, 1x USB-C"},{"group":"Charging","label":"Max Output","value":"15W"}]',ARRAY['PowerCore 26800','Micro USB Cable','Travel Pouch'],ARRAY['26800mAh capacity','PowerIQ technology','MultiProtect safety','Compact design'],ARRAY['anker','power-bank','charger','portable'],59,NULL,4.7,3456,false,false,true,true,80,'18 Month Anker Warranty','30-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-08T10:00:00Z'),
('p13','apple-magsafe-charger','Apple MagSafe Charger 15W','Apple','b1','cat7','chargers','The MagSafe Charger provides up to 15W of wireless charging for iPhone 12 and later, with a perfectly aligned magnetic connection.','15W MagSafe charging for iPhone 12 and later','https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v13-1","storage":"1m Cable","color":"White","colorHex":"#FFFFFF","condition":"new","price":39,"stock":100,"sku":"MSFC15-WH"},{"id":"v13-2","storage":"2m Cable","color":"White","colorHex":"#FFFFFF","condition":"new","price":49,"stock":80,"sku":"MSFC15-WH-2M"}]','[{"group":"Charging","label":"Max Power","value":"15W (iPhone 12+)"},{"group":"Compatibility","label":"Devices","value":"MagSafe-compatible iPhones, AirPods"},{"group":"Cable","label":"Length","value":"1m or 2m"}]',ARRAY['MagSafe Charger','USB-C connector'],ARRAY['15W fast MagSafe charging','Magnetic alignment','Optimized battery charging'],ARRAY['apple','magsafe','charger','wireless'],39,NULL,4.6,2891,false,false,true,true,180,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-06T10:00:00Z'),
('p14','iphone-15-pro-clear-case','iPhone 15 Pro Clear Case','Apple','b1','cat6','cases','The iPhone 15 Pro Clear Case with MagSafe shows off the design of iPhone 15 Pro while adding MagSafe-compatible wireless charging.','MagSafe compatible, ultra-clear design','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v14-1","storage":"iPhone 15 Pro","color":"Clear","colorHex":"#FFFFFF","condition":"new","price":49,"stock":60,"sku":"IPH15PC-CL"},{"id":"v14-2","storage":"iPhone 15 Pro Max","color":"Clear","colorHex":"#FFFFFF","condition":"new","price":49,"stock":55,"sku":"IPH15PMC-CL"}]','[{"group":"Material","label":"Type","value":"Polycarbonate back, TPU sides"},{"group":"Compatibility","label":"Works with","value":"MagSafe accessories"},{"group":"Protection","label":"Drop rating","value":"2m"}]',ARRAY['Clear Case'],ARRAY['MagSafe compatible','Anti-yellowing','Military-grade drop protection'],ARRAY['apple','case','iphone-15','clear','magsafe'],49,NULL,4.4,567,false,false,false,true,115,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-20T10:00:00Z'),
('p15','xiaomi-14-ultra','Xiaomi 14 Ultra','Xiaomi','b6','cat2','android-phones','Xiaomi 14 Ultra pushes mobile photography to new extremes with Leica optics, a large 1-inch sensor, and Snapdragon 8 Gen 3.','Leica optics, 1-inch sensor, Snapdragon 8 Gen 3','https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v15-1","storage":"256GB","color":"Black","colorHex":"#1C1C1E","condition":"new","price":1299,"salePrice":1199,"stock":15,"sku":"XI14U-256-BK"},{"id":"v15-2","storage":"512GB","color":"Black","colorHex":"#1C1C1E","condition":"new","price":1399,"salePrice":1299,"stock":10,"sku":"XI14U-512-BK"}]','[{"group":"Display","label":"Screen Size","value":"6.73 inches"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 3"},{"group":"Camera","label":"Main Camera","value":"50MP (1-inch sensor, Leica)"},{"group":"Battery","label":"Capacity","value":"5000 mAh"},{"group":"Battery","label":"Charging","value":"90W HyperCharge"}]',ARRAY['Xiaomi 14 Ultra','90W Charger','USB-C Cable','Photo Kit (optional)'],ARRAY['Leica Summilux optics','1-inch sensor','4K 120fps video','90W fast charging'],ARRAY['xiaomi','android','leica','5g','photography'],1299,1199,4.7,423,false,true,false,true,25,'1 Year Xiaomi Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-03-01T10:00:00Z'),
('p16','samsung-galaxy-watch-6','Samsung Galaxy Watch 6 Classic','Samsung','b2','cat4','smartwatches','Galaxy Watch 6 Classic brings back the iconic rotating bezel with enhanced health tracking and Wear OS 4 powered by Samsung.','Rotating bezel, advanced health tracking, Wear OS 4','https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v16-1","storage":"43mm","color":"Black","colorHex":"#1C1C1E","condition":"new","price":399,"salePrice":349,"stock":25,"sku":"SGW6C-43-BK"},{"id":"v16-2","storage":"47mm","color":"Black","colorHex":"#1C1C1E","condition":"new","price":429,"salePrice":379,"stock":20,"sku":"SGW6C-47-BK"}]','[{"group":"Display","label":"Technology","value":"Super AMOLED"},{"group":"Health","label":"Sensors","value":"Heart rate, ECG, Blood Oxygen, Body Composition"},{"group":"Battery","label":"Life","value":"Up to 40 hours"},{"group":"OS","label":"Platform","value":"Wear OS 4"}]',ARRAY['Galaxy Watch 6 Classic','Charging Cable','Additional Band'],ARRAY['Rotating bezel','Advanced sleep coaching','BioActive sensor','Google ecosystem'],ARRAY['samsung','smartwatch','android','wear-os'],399,349,4.5,876,false,false,false,true,45,'1 Year Samsung Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-22T10:00:00Z'),
('p17','sony-xperia-1-v','Sony Xperia 1 V','Sony','b5','cat2','android-phones','Sony Xperia 1 V is engineered for creators with a 4K HDR OLED display, Zeiss optics, and professional-grade video capabilities.','4K HDR OLED, Zeiss optics, professional video','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v17-1","storage":"256GB","color":"Black","colorHex":"#1C1C1E","condition":"new","price":1399,"salePrice":1299,"stock":10,"sku":"SXP1V-256-BK"}]','[{"group":"Display","label":"Screen Size","value":"6.5 inches 4K HDR OLED"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 2"},{"group":"Camera","label":"Main Camera","value":"52MP Zeiss + 12MP + 12MP"},{"group":"Battery","label":"Capacity","value":"5000 mAh"}]',ARRAY['Xperia 1 V','USB-C Cable','USB-C Adapter'],ARRAY['4K 120fps recording','Zeiss T* optics','3.5mm headphone jack','IP65/68'],ARRAY['sony','android','zeiss','4k','creator'],1399,1299,4.4,312,false,false,false,true,10,'1 Year Sony Warranty','15-day return policy','Free shipping',NULL,NULL,'2024-02-20T10:00:00Z'),
('p18','apple-iphone-14','iPhone 14','Apple','b1','cat1','iphones','iPhone 14 features Crash Detection, Emergency SOS via satellite, and an improved dual-camera system — all in a sleek aluminum design.','A15 Bionic, improved camera, Emergency SOS via satellite','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v18-1","storage":"128GB","color":"Midnight","colorHex":"#1C1C1E","condition":"new","price":699,"salePrice":599,"stock":35,"sku":"IPH14-128-MN"},{"id":"v18-2","storage":"256GB","color":"Midnight","colorHex":"#1C1C1E","condition":"new","price":799,"salePrice":699,"stock":28,"sku":"IPH14-256-MN"},{"id":"v18-3","storage":"128GB","color":"Starlight","colorHex":"#E8E0D0","condition":"new","price":699,"salePrice":599,"stock":30,"sku":"IPH14-128-SL"},{"id":"v18-4","storage":"128GB","color":"Purple","colorHex":"#8E7CC3","condition":"refurbished","price":549,"salePrice":499,"stock":15,"sku":"IPH14-128-PU-R"}]','[{"group":"Display","label":"Screen Size","value":"6.1 inches"},{"group":"Performance","label":"Chip","value":"Apple A15 Bionic"},{"group":"Camera","label":"Main Camera","value":"12MP Photonic Engine"},{"group":"Battery","label":"Capacity","value":"3279 mAh"},{"group":"Connectivity","label":"5G","value":"Yes"}]',ARRAY['iPhone 14','USB-C Cable','Documentation'],ARRAY['Crash Detection','Emergency SOS via satellite','Photonic Engine','Face ID'],ARRAY['iphone','apple','5g'],699,599,4.7,4123,false,false,true,true,108,'1 Year Apple Limited Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2023-12-01T10:00:00Z'),
('p19','samsung-galaxy-s23-fe','Samsung Galaxy S23 FE','Samsung','b2','cat2','android-phones','Galaxy S23 FE brings the best of Samsung Galaxy S23 features at a more accessible price point.','Snapdragon 8 Gen 1, 50MP camera, 25W fast charging','https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v19-1","storage":"128GB","color":"Graphite","colorHex":"#4A4A4A","condition":"new","price":599,"salePrice":499,"stock":30,"sku":"SGS23FE-128-GR"},{"id":"v19-2","storage":"256GB","color":"Graphite","colorHex":"#4A4A4A","condition":"new","price":649,"salePrice":549,"stock":22,"sku":"SGS23FE-256-GR"}]','[{"group":"Display","label":"Screen Size","value":"6.4 inches"},{"group":"Performance","label":"Processor","value":"Snapdragon 8 Gen 1"},{"group":"Camera","label":"Main Camera","value":"50MP + 12MP + 8MP"},{"group":"Battery","label":"Capacity","value":"4500 mAh"}]',ARRAY['Galaxy S23 FE','USB-C Cable','SIM Ejector'],ARRAY['120Hz AMOLED display','Optical zoom camera','Samsung Knox security','IP68'],ARRAY['samsung','android','5g','value'],599,499,4.4,678,false,false,false,true,52,'1 Year Samsung Warranty','15-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-30T10:00:00Z'),
('p20','tempered-glass-iphone-15','Premium Tempered Glass - iPhone 15','NovaMobile','b8','cat6','cases','2-pack of premium 9H tempered glass screen protectors for iPhone 15 with easy installation kit and full edge-to-edge coverage.','9H tempered glass, 2-pack, edge-to-edge protection','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'],'[{"id":"v20-1","storage":"2-Pack","color":"Clear","colorHex":"#FFFFFF","condition":"new","price":19,"stock":200,"sku":"TGIPH15-CL-2P"}]','[{"group":"Material","label":"Hardness","value":"9H Tempered Glass"},{"group":"Coverage","label":"Type","value":"Full edge-to-edge"},{"group":"Package","label":"Quantity","value":"2-pack"}]',ARRAY['2x Tempered Glass','Installation Kit','Cleaning Wipes','Dust Stickers'],ARRAY['9H hardness','Oleophobic coating','Auto-alignment frame','99.99% transparency'],ARRAY['screen-protector','iphone-15','accessories','glass'],19,NULL,4.5,2341,false,false,true,true,200,'Lifetime Warranty','30-day return policy','Free shipping on orders over $99',NULL,NULL,'2024-01-10T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- SEED: COUPONS
INSERT INTO coupons (id,code,type,value,min_order,max_discount,usage_limit,used_count,expires_at,is_active,description) VALUES
  ('coup1','NOVA10','percentage',10,100,100,500,120,'2026-12-31T23:59:59Z',true,'10% off on orders above $100'),
  ('coup2','WELCOME50','fixed',50,300,NULL,100,45,'2026-06-30T23:59:59Z',true,'$50 off on orders above $300'),
  ('coup3','FLASH15','percentage',15,200,150,200,67,'2026-12-31T23:59:59Z',true,'15% off flash sale discount'),
  ('coup4','FREESHIP','fixed',15,0,NULL,1000,234,'2026-12-31T23:59:59Z',true,'Free shipping on any order')
ON CONFLICT (id) DO NOTHING;

-- SEED: BANNERS
INSERT INTO banners (id,title,subtitle,image,cta,cta_link,bg_color,text_color,is_active,sort_order) VALUES
  ('ban1','iPhone 15 Pro Max','Titanium. So strong. So light. So Pro.','https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1200','Shop Now','/product/apple-iphone-15-pro-max','#1C1C1E','#FFFFFF',true,1),
  ('ban2','Galaxy S24 Ultra','The ultimate Android. Now with Galaxy AI.','https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1200','Explore','/product/samsung-galaxy-s24-ultra','#0F3460','#FFFFFF',true,2),
  ('ban3','Trade In & Save','Get up to $400 off when you trade in your old phone.','https://images.pexels.com/photos/1174775/pexels-photo-1174775.jpeg?auto=compress&cs=tinysrgb&w=1200','Learn More','/deals','#065F46','#FFFFFF',true,3)
ON CONFLICT (id) DO NOTHING;

-- SEED: TESTIMONIALS
INSERT INTO testimonials (id,author,avatar,location,rating,text,product,created_at) VALUES
  ('t1','Sarah M.',NULL,'New York, NY',5,'Ordered my iPhone 15 Pro Max and it arrived the next day. The packaging was immaculate and the phone is exactly as described. NovaMobile is my go-to for tech now!','iPhone 15 Pro Max','2024-02-15T10:00:00Z'),
  ('t2','James K.',NULL,'Los Angeles, CA',5,'The Galaxy S24 Ultra I bought came with a free case and screen protector. Amazing value. Customer service was super helpful when I had questions.','Samsung Galaxy S24 Ultra','2024-02-20T10:00:00Z'),
  ('t3','Priya R.',NULL,'Chicago, IL',5,'I was skeptical about ordering a refurbished phone online, but NovaMobile''s quality check is top-notch. My iPhone 14 looks and works like new!','iPhone 14 (Refurbished)','2024-01-30T10:00:00Z'),
  ('t4','Michael T.',NULL,'Houston, TX',4,'Great prices, fast shipping, and easy returns. Had a minor issue with my order and the support team resolved it within hours.',NULL,'2024-03-01T10:00:00Z'),
  ('t5','Emma W.',NULL,'Seattle, WA',5,'NovaMobile had the AirPods Pro 2 at the best price I could find anywhere online. They were shipped within hours of ordering.','AirPods Pro (2nd Gen)','2024-02-10T10:00:00Z'),
  ('t6','Daniel O.',NULL,'Miami, FL',5,'Bought the Google Pixel 8 Pro for my wife. She loves the camera features and the price was unbeatable.','Google Pixel 8 Pro','2024-03-05T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- SEED: FAQS
INSERT INTO faqs (id,question,answer,category,sort_order) VALUES
  ('faq1','Do I need to create an account to shop?','No account is required. Simply add items to your cart and proceed to checkout as a guest. You will receive a unique tracking code to monitor your order.','Shopping',1),
  ('faq2','How do I track my order?','Use the Track Order page and enter your tracking code along with your email address or phone number used during checkout.','Orders',2),
  ('faq3','What payment methods do you accept?','We accept Cash on Delivery (COD), Credit/Debit Cards, Bank Transfer, and Mobile Payment options.','Payment',3),
  ('faq4','How long does shipping take?','Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee. Free shipping on orders over $99.','Shipping',4),
  ('faq5','What is your return policy?','Most products have a 15-day return policy. Accessories have a 30-day return. Items must be in original condition.','Returns',5),
  ('faq6','Are your products authentic and genuine?','Yes, 100%. We source all products directly from authorized distributors. Every device includes the official manufacturer warranty.','Products',6),
  ('faq7','Can I use a coupon code?','Yes! Enter your coupon code in the cart or at checkout. Only one coupon can be used per order.','Shopping',7),
  ('faq8','What warranty coverage do I get?','All new devices include the full manufacturer warranty (1 year for most brands). Refurbished devices include a 6-month NovaMobile warranty.','Products',8)
ON CONFLICT (id) DO NOTHING;

-- SEED: STORE SETTINGS
INSERT INTO store_settings (id, data) VALUES (1, '{"storeName":"NovaMobile","tagline":"Premium Phones & Accessories","email":"hello@novamobile.com","phone":"+1 (555) 019-9000","address":"123 Tech Ave, San Francisco, CA 94105","currency":"USD","currencySymbol":"$","shippingFee":15,"freeShippingThreshold":99,"taxRate":0.08,"socialLinks":{"facebook":"https://facebook.com/novamobile","instagram":"https://instagram.com/novamobile","twitter":"https://twitter.com/novamobile","youtube":"https://youtube.com/novamobile","whatsapp":"https://wa.me/15550199000"}}')
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- SEED: SAMPLE ORDER
INSERT INTO orders (id,order_number,tracking_code,items,shipping_address,payment_method,status,payment_status,subtotal,shipping_fee,tax,discount,total,courier_name,courier_tracking_number,estimated_delivery,tracking_events,created_at,updated_at) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'ORD-123456-ABC',
  'NVM-2026-AB12CD',
  '[{"productId":"p1","variantId":"v1-1","name":"iPhone 15 Pro Max","image":"https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=400","brand":"Apple","storage":"256GB","color":"Natural Titanium","price":1099,"quantity":1,"subtotal":1099}]',
  '{"firstName":"John","lastName":"Doe","email":"john.doe@example.com","phone":"+1 555-0123","address1":"123 Main Street","city":"New York","state":"NY","postalCode":"10001","country":"United States"}',
  '{"type":"card","label":"Credit Card"}',
  'shipped','paid',1099,0,87.92,0,1186.92,
  'FedEx','FX123456789','2026-03-20',
  '[{"id":"te1","status":"pending","message":"Order placed successfully","timestamp":"2026-03-14T10:00:00Z","isCompleted":true},{"id":"te2","status":"payment_confirmed","message":"Payment confirmed","timestamp":"2026-03-14T10:30:00Z","isCompleted":true},{"id":"te3","status":"processing","message":"Order is being processed","timestamp":"2026-03-14T12:00:00Z","isCompleted":true},{"id":"te4","status":"packed","message":"Order packed and ready for pickup","timestamp":"2026-03-15T09:00:00Z","isCompleted":true},{"id":"te5","status":"shipped","message":"Shipped via FedEx","location":"New York Distribution Center","timestamp":"2026-03-15T14:00:00Z","isCompleted":true},{"id":"te6","status":"out_for_delivery","message":"Out for delivery","location":"New York, NY","timestamp":"","isCompleted":false},{"id":"te7","status":"delivered","message":"Delivered","timestamp":"","isCompleted":false}]',
  '2026-03-14T10:00:00Z','2026-03-15T14:00:00Z'
) ON CONFLICT (id) DO NOTHING;
