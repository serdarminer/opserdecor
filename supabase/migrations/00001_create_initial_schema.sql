-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create is_admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create products table (bilingual)
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr text NOT NULL,
  name_en text NOT NULL,
  description_tr text NOT NULL,
  description_en text NOT NULL,
  usage_areas_tr text,
  usage_areas_en text,
  technical_specs_tr text,
  technical_specs_en text,
  image_url text,
  category text NOT NULL, -- 'finish_foil', 'decorative_paper', 'pp_foil'
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create decors table (bilingual)
CREATE TABLE public.decors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description_tr text,
  description_en text,
  image_url text NOT NULL,
  color_group text,
  pattern_category text,
  compatible_product_type text, -- 'finish_foil', 'decorative_paper', 'pp_foil', 'all'
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE decors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view decors" ON decors
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage decors" ON decors
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create news table (bilingual)
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  title_en text NOT NULL,
  content_tr text NOT NULL,
  content_en text NOT NULL,
  cover_image_url text,
  published_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'draft', -- 'draft', 'published'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "Admins can view all news" ON news
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage news" ON news
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact messages" ON contact_messages
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create site_content table (bilingual)
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  content_tr text NOT NULL,
  content_en text NOT NULL,
  image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content" ON site_content
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage site content" ON site_content
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_decors_color_group ON decors(color_group);
CREATE INDEX idx_decors_pattern_category ON decors(pattern_category);
CREATE INDEX idx_decors_compatible_product ON decors(compatible_product_type);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_date ON news(published_date DESC);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_site_content_key ON site_content(key);