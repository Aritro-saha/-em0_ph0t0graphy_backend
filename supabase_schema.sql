
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Store admin information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  website_url TEXT,
  avatar_url TEXT
);

-- Content: Hero, About, Pricing
CREATE TABLE IF NOT EXISTS public.content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  section TEXT NOT NULL, -- 'hero', 'about', 'pricing'
  key TEXT NOT NULL,     -- 'title', 'description', 'price_list'
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, section, key)
);

-- Portfolio: Main portfolio images
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Galleries: Client specific galleries
CREATE TABLE IF NOT EXISTS public.galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  pin TEXT, -- PIN protection
  cover_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Gallery Images: Images within a gallery
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES public.galleries ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  full_res_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages: Contact form submissions
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (Example for reading public data)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public content is viewable by everyone" ON public.content FOR SELECT USING (true);
CREATE POLICY "Public portfolio is viewable by everyone" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Public galleries are viewable by everyone" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Public gallery_images are viewable by everyone" ON public.gallery_images FOR SELECT USING (true);

-- Insert policies for messages
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
