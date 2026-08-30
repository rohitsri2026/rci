-- ====================================================================
-- RCI WEBSITE CENTRALIZED CMS COMPREHENSIVE SCHEMA & FIX MIGRATION
-- Run this script in your Supabase SQL Editor
-- This script is safe, non-destructive, and idempotent.
-- ====================================================================

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  site_name VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI)',
  short_name VARCHAR(100) NOT NULL DEFAULT 'RCI',
  tagline VARCHAR(255) NOT NULL DEFAULT 'Empowering Digital Careers',
  logo_url TEXT NULL,
  favicon_url TEXT NULL,
  primary_color VARCHAR(20) NOT NULL DEFAULT '#07152F',
  secondary_color VARCHAR(20) NOT NULL DEFAULT '#155EEF',
  accent_color VARCHAR(20) NOT NULL DEFAULT '#D4A72C',
  browser_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT & Computer Education',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS site_name VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI)',
  ADD COLUMN IF NOT EXISTS short_name VARCHAR(100) NOT NULL DEFAULT 'RCI',
  ADD COLUMN IF NOT EXISTS tagline VARCHAR(255) NOT NULL DEFAULT 'Empowering Digital Careers',
  ADD COLUMN IF NOT EXISTS logo_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20) NOT NULL DEFAULT '#07152F',
  ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(20) NOT NULL DEFAULT '#155EEF',
  ADD COLUMN IF NOT EXISTS accent_color VARCHAR(20) NOT NULL DEFAULT '#D4A72C',
  ADD COLUMN IF NOT EXISTS browser_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT & Computer Education',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.site_settings (id, site_name, short_name, tagline, primary_color, secondary_color, accent_color, browser_title)
VALUES ('default', 'Rohit Computer Institute (RCI)', 'RCI', 'Empowering Digital Careers', '#07152F', '#155EEF', '#D4A72C', 'Rohit Computer Institute (RCI) | Practical IT & Computer Education')
ON CONFLICT (id) DO NOTHING;

-- 2. DIRECTOR & INSTITUTE PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.director_profile (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  name VARCHAR(255) NOT NULL DEFAULT 'Rohit Srivastava',
  photo_url TEXT NULL,
  designation VARCHAR(255) NOT NULL DEFAULT 'Managing Director, RCI',
  message TEXT NOT NULL DEFAULT 'At Rohit Computer Institute, our goal is to bridge the gap between theoretical knowledge and practical industry skills. We empower our students with hands-on lab training, experienced mentorship, and government/MSME recognized certifications to launch successful digital careers.',
  signature_url TEXT NULL,
  established_year VARCHAR(50) NOT NULL DEFAULT '2010',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.director_profile
  ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'Rohit Srivastava',
  ADD COLUMN IF NOT EXISTS photo_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS designation VARCHAR(255) NOT NULL DEFAULT 'Managing Director, RCI',
  ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT 'At Rohit Computer Institute, our goal is to bridge the gap between theoretical knowledge and practical industry skills.',
  ADD COLUMN IF NOT EXISTS signature_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS established_year VARCHAR(50) NOT NULL DEFAULT '2010',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.director_profile (id, name, designation, message, established_year)
VALUES ('default', 'Rohit Srivastava', 'Managing Director, RCI', 'At Rohit Computer Institute, our goal is to bridge the gap between theoretical knowledge and practical industry skills. We empower our students with hands-on lab training, experienced mentorship, and government/MSME recognized certifications to launch successful digital careers.', '2010')
ON CONFLICT (id) DO NOTHING;

-- 3. HOMEPAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  hero_badge VARCHAR(255) NOT NULL DEFAULT 'Trusted Computer Education',
  hero_title VARCHAR(255) NOT NULL DEFAULT 'Build Your Digital Future',
  hero_highlight VARCHAR(255) NOT NULL DEFAULT 'With Practical IT Skills',
  hero_description TEXT NOT NULL DEFAULT 'Master modern computer applications, Tally Prime accounting, web development, and programming with hands-on lab training and QR-verifiable certificates.',
  hero_image_url TEXT NULL,
  hero_bg_url TEXT NULL,
  primary_cta_text VARCHAR(100) NOT NULL DEFAULT 'Explore Courses',
  primary_cta_url VARCHAR(255) NOT NULL DEFAULT '/courses',
  secondary_cta_text VARCHAR(100) NOT NULL DEFAULT 'Student Login',
  secondary_cta_url VARCHAR(255) NOT NULL DEFAULT '/student/login',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.homepage_settings
  ADD COLUMN IF NOT EXISTS hero_badge VARCHAR(255) NOT NULL DEFAULT 'Trusted Computer Education',
  ADD COLUMN IF NOT EXISTS hero_title VARCHAR(255) NOT NULL DEFAULT 'Build Your Digital Future',
  ADD COLUMN IF NOT EXISTS hero_highlight VARCHAR(255) NOT NULL DEFAULT 'With Practical IT Skills',
  ADD COLUMN IF NOT EXISTS hero_description TEXT NOT NULL DEFAULT 'Master modern computer applications, Tally Prime accounting, web development, and programming with hands-on lab training and QR-verifiable certificates.',
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS hero_bg_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS primary_cta_text VARCHAR(100) NOT NULL DEFAULT 'Explore Courses',
  ADD COLUMN IF NOT EXISTS primary_cta_url VARCHAR(255) NOT NULL DEFAULT '/courses',
  ADD COLUMN IF NOT EXISTS secondary_cta_text VARCHAR(100) NOT NULL DEFAULT 'Student Login',
  ADD COLUMN IF NOT EXISTS secondary_cta_url VARCHAR(255) NOT NULL DEFAULT '/student/login',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.homepage_settings (id, hero_badge, hero_title, hero_highlight, hero_description, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url)
VALUES ('default', 'Trusted Computer Education', 'Build Your Digital Future', 'With Practical IT Skills', 'Master modern computer applications, Tally Prime accounting, web development, and programming with hands-on lab training and QR-verifiable certificates.', 'Explore Courses', '/courses', 'Student Login', '/student/login')
ON CONFLICT (id) DO NOTHING;

-- 4. HOMEPAGE BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT NULL,
  cta_text VARCHAR(100) NULL,
  cta_url VARCHAR(255) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.homepage_banners
  ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description TEXT NULL,
  ADD COLUMN IF NOT EXISTS desktop_image_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mobile_image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS cta_text VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS cta_url VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 5. ANNOUNCEMENT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.announcement_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  message TEXT NOT NULL DEFAULT 'Admissions Open for New Batches 2026! Enroll today for DCA, ADCA & Tally Prime.',
  link_text VARCHAR(100) NOT NULL DEFAULT 'Apply Now',
  link_url VARCHAR(255) NOT NULL DEFAULT '/admission',
  start_at TIMESTAMP WITH TIME ZONE NULL,
  end_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.announcement_settings
  ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT 'Admissions Open for New Batches 2026!',
  ADD COLUMN IF NOT EXISTS link_text VARCHAR(100) NOT NULL DEFAULT 'Apply Now',
  ADD COLUMN IF NOT EXISTS link_url VARCHAR(255) NOT NULL DEFAULT '/admission',
  ADD COLUMN IF NOT EXISTS start_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS end_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.announcement_settings (id, is_enabled, message, link_text, link_url)
VALUES ('default', true, 'Admissions Open for New Batches 2026! Enroll today for DCA, ADCA & Tally Prime.', 'Apply Now', '/admission')
ON CONFLICT (id) DO NOTHING;

-- 6. ABOUT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  heading VARCHAR(255) NOT NULL,
  short_description TEXT NULL,
  content TEXT NOT NULL,
  image_url TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.about_sections
  ADD COLUMN IF NOT EXISTS section_key VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS heading VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS short_description TEXT NULL,
  ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.about_sections (section_key, heading, short_description, content, is_active)
VALUES 
  ('about_rci', 'About Rohit Computer Institute', 'Empowering Kanpur youth with practical tech education since 2010.', 'Rohit Computer Institute (RCI) is a premier computer training institute dedicated to offering practical, industry-aligned IT education. With state-of-the-art computer labs, experienced faculty, and comprehensive curriculum, we prepare students for real-world job opportunities.', true),
  ('mission', 'Our Mission', 'Quality computer education accessible to everyone.', 'To empower every student with practical, job-oriented computer skills and industry certifications that open doors to rewarding career opportunities.', true),
  ('vision', 'Our Vision', 'Leading digital skill development in Uttar Pradesh.', 'To be the most trusted and innovative computer education institute in the region, known for practical training, student success, and technological excellence.', true)
ON CONFLICT (section_key) DO NOTHING;

-- 7. HOMEPAGE FEATURES TABLE ("Why Choose RCI")
CREATE TABLE IF NOT EXISTS public.homepage_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL DEFAULT 'GraduationCap',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.homepage_features
  ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS icon VARCHAR(100) NOT NULL DEFAULT 'GraduationCap',
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.homepage_features (title, description, icon, display_order, is_active)
VALUES 
  ('Experienced Faculty', 'Learn directly from certified IT professionals with years of teaching experience.', 'Users', 1, true),
  ('Practical Lab Training', '1:1 computer access with hands-on practice sessions for every topic.', 'Laptop', 2, true),
  ('Affordable Fee Structure', 'High quality education with flexible installment options.', 'BadgeCheck', 3, true),
  ('Recognized Certificates', 'MSME & Government registered certificates with instant QR verification.', 'Award', 4, true),
  ('Career Guidance & Placement', 'Resume building, mock interviews, and job placement assistance.', 'Briefcase', 5, true),
  ('Modern Lab Infrastructure', 'High-speed internet, latest software, and comfortable learning environment.', 'Server', 6, true)
ON CONFLICT DO NOTHING;

-- 8. HOMEPAGE STATISTICS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  icon VARCHAR(100) NOT NULL DEFAULT 'Users',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.homepage_stats
  ADD COLUMN IF NOT EXISTS label VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS value VARCHAR(50) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS icon VARCHAR(100) NOT NULL DEFAULT 'Users',
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.homepage_stats (label, value, icon, display_order, is_active)
VALUES 
  ('Students Trained', '5000+', 'Users', 1, true),
  ('Courses Offered', '15+', 'BookOpen', 2, true),
  ('Certificates Issued', '4500+', 'Award', 3, true),
  ('Years of Experience', '14+', 'Clock', 4, true)
ON CONFLICT DO NOTHING;

-- 9. CONTACT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  phone VARCHAR(100) NOT NULL DEFAULT '+91 73768 93097',
  whatsapp VARCHAR(100) NOT NULL DEFAULT '917376893097',
  email VARCHAR(255) NOT NULL DEFAULT 'info@rciknp.com',
  address TEXT NOT NULL DEFAULT 'Sanjay Nagar Cantt, Kanpur, Uttar Pradesh — 208004',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Sanjay+Nagar+Cantt+Kanpur',
  office_hours VARCHAR(255) NOT NULL DEFAULT 'Mon - Sat: 8:00 AM - 7:00 PM',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_settings
  ADD COLUMN IF NOT EXISTS phone VARCHAR(100) NOT NULL DEFAULT '+91 73768 93097',
  ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(100) NOT NULL DEFAULT '917376893097',
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT 'info@rciknp.com',
  ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT 'Sanjay Nagar Cantt, Kanpur, Uttar Pradesh — 208004',
  ADD COLUMN IF NOT EXISTS maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Sanjay+Nagar+Cantt+Kanpur',
  ADD COLUMN IF NOT EXISTS office_hours VARCHAR(255) NOT NULL DEFAULT 'Mon - Sat: 8:00 AM - 7:00 PM',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.contact_settings (id, phone, whatsapp, email, address, maps_url, office_hours)
VALUES ('default', '+91 73768 93097', '917376893097', 'info@rciknp.com', 'Sanjay Nagar Cantt, Kanpur, Uttar Pradesh — 208004', 'https://maps.google.com/?q=Sanjay+Nagar+Cantt+Kanpur', 'Mon - Sat: 8:00 AM - 7:00 PM')
ON CONFLICT (id) DO NOTHING;

-- 10. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.social_links
  ADD COLUMN IF NOT EXISTS platform VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.social_links (platform, url, is_active, display_order)
VALUES 
  ('Facebook', 'https://facebook.com', true, 1),
  ('Instagram', 'https://instagram.com', true, 2),
  ('YouTube', 'https://youtube.com', true, 3),
  ('WhatsApp', 'https://wa.me/917376893097', true, 4)
ON CONFLICT DO NOTHING;

-- 11. NAVIGATION LINKS TABLE
CREATE TABLE IF NOT EXISTS public.navigation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  open_new_tab BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.navigation_links
  ADD COLUMN IF NOT EXISTS location VARCHAR(50) NOT NULL DEFAULT 'header',
  ADD COLUMN IF NOT EXISTS label VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS url VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS open_new_tab BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.navigation_links (location, label, url, open_new_tab, display_order, is_active, is_system)
VALUES 
  ('header', 'Home', '/', false, 1, true, false),
  ('header', 'About', '/about', false, 2, true, false),
  ('header', 'Courses', '/courses', false, 3, true, false),
  ('header', 'Admissions', '/admission', false, 4, true, false),
  ('header', 'Verify Certificate', '/verify', false, 5, true, true),
  ('header', 'Contact', '/contact', false, 6, true, false),
  ('footer_quick', 'Home', '/', false, 1, true, false),
  ('footer_quick', 'About Us', '/about', false, 2, true, false),
  ('footer_quick', 'Our Courses', '/courses', false, 3, true, false),
  ('footer_quick', 'Admission Workflow', '/admission', false, 4, true, false),
  ('footer_quick', 'Contact Us', '/contact', false, 5, true, false),
  ('footer_useful', 'Verify Certificate', '/verify', false, 1, true, true),
  ('footer_useful', 'Student Portal Login', '/student/login', false, 2, true, true),
  ('footer_useful', 'Admin Control Panel', '/admin/login', false, 3, true, true)
ON CONFLICT DO NOTHING;

-- 12. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  site_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT & Computer Education',
  meta_description TEXT NOT NULL DEFAULT 'Rohit Computer Institute (RCI) provides practical computer training, DCA diploma, Tally Prime accounting, Web Development, Python, and QR-verifiable certificates.',
  keywords TEXT NOT NULL DEFAULT 'Rohit Computer Institute, RCI Kanpur, Computer Institute Kanpur, DCA Course, Tally Prime GST Course, Web Development Training, Certificate Verification RCI',
  og_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT & Computer Education',
  og_description TEXT NOT NULL DEFAULT 'Build career-oriented computer skills with expert faculty, modern labs, and verifiable certificates.',
  og_image_url TEXT NULL,
  twitter_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT Education',
  twitter_description TEXT NOT NULL DEFAULT 'Build skills and build your career with RCI computer courses and verifiable certifications.',
  twitter_image_url TEXT NULL,
  canonical_url VARCHAR(255) NOT NULL DEFAULT 'https://rciknp.vercel.app',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS site_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI) | Practical IT & Computer Education',
  ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT 'Rohit Computer Institute (RCI) provides practical computer training.',
  ADD COLUMN IF NOT EXISTS keywords TEXT NOT NULL DEFAULT 'Rohit Computer Institute, RCI Kanpur',
  ADD COLUMN IF NOT EXISTS og_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI)',
  ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT 'Build career-oriented computer skills.',
  ADD COLUMN IF NOT EXISTS og_image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS twitter_title VARCHAR(255) NOT NULL DEFAULT 'Rohit Computer Institute (RCI)',
  ADD COLUMN IF NOT EXISTS twitter_description TEXT NOT NULL DEFAULT 'Build skills and build your career.',
  ADD COLUMN IF NOT EXISTS twitter_image_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255) NOT NULL DEFAULT 'https://rciknp.vercel.app',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.seo_settings (id, site_title, meta_description, keywords, og_title, og_description, twitter_title, twitter_description, canonical_url)
VALUES ('default', 'Rohit Computer Institute (RCI) | Practical IT & Computer Education', 'Rohit Computer Institute (RCI) provides practical computer training, DCA diploma, Tally Prime accounting, Web Development, Python, and QR-verifiable certificates.', 'Rohit Computer Institute, RCI Kanpur, Computer Institute Kanpur, DCA Course, Tally Prime GST Course, Web Development Training, Certificate Verification RCI', 'Rohit Computer Institute (RCI) | Practical IT & Computer Education', 'Build career-oriented computer skills with expert faculty, modern labs, and verifiable certificates.', 'Rohit Computer Institute (RCI) | Practical IT Education', 'Build skills and build your career with RCI computer courses and verifiable certifications.', 'https://rciknp.vercel.app')
ON CONFLICT (id) DO NOTHING;

-- 13. CMS MEDIA TRACKING TABLE
CREATE TABLE IF NOT EXISTS public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL DEFAULT 'media',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.cms_media
  ADD COLUMN IF NOT EXISTS filename VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS file_path TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS public_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS size_bytes BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'media',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- ====================================================================
-- SUPABASE STORAGE BUCKET SETUP
-- ====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Access for website-assets" ON storage.objects;
CREATE POLICY "Public Read Access for website-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Authenticated Users Insert Access for website-assets" ON storage.objects;
CREATE POLICY "Authenticated Users Insert Access for website-assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Authenticated Users Update Access for website-assets" ON storage.objects;
CREATE POLICY "Authenticated Users Update Access for website-assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Authenticated Users Delete Access for website-assets" ON storage.objects;
CREATE POLICY "Authenticated Users Delete Access for website-assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'website-assets');

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR CMS TABLES
-- ====================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.director_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'site_settings', 'director_profile', 'homepage_settings', 'homepage_banners',
    'announcement_settings', 'about_sections', 'homepage_features', 'homepage_stats',
    'contact_settings', 'social_links', 'navigation_links', 'seo_settings', 'cms_media'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read access for %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public read access for %I" ON public.%I FOR SELECT USING (true)', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "Authenticated write access for %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Authenticated write access for %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;

-- ====================================================================
-- RELOAD SUPABASE POSTGREST SCHEMA CACHE
-- ====================================================================
NOTIFY pgrst, 'reload schema';
