-- DATABASE MIGRATION SCRIPT FOR RCI CERTIFICATE MANAGEMENT SYSTEM
-- Run this script in your Supabase SQL Editor

-- 1. Create User Profiles Table for Roles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'Viewer', -- 'Admin', 'Staff', 'Viewer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Trigger function to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'Viewer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile for existing users as Admin
INSERT INTO public.user_profiles (id, role)
SELECT id, 'Admin' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. Alter Certificates Table
-- Drop unique constraint if exists on old column
ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS certificates_certificate_id_key;

-- Rename certificate_id to certificate_number if it exists and rename hasn't happened yet
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'certificate_id') THEN
    ALTER TABLE public.certificates RENAME COLUMN certificate_id TO certificate_number;
  END IF;
END $$;

-- Add new columns to certificates table
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS completion_date DATE,
  ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
  ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS certificate_pdf_url TEXT;

-- Make older static columns nullable for compatibility
ALTER TABLE public.certificates ALTER COLUMN student_name DROP NOT NULL;
ALTER TABLE public.certificates ALTER COLUMN course_name DROP NOT NULL;

-- Ensure certificate_number is unique
ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS certificates_certificate_number_key;
ALTER TABLE public.certificates ADD CONSTRAINT certificates_certificate_number_key UNIQUE (certificate_number);

-- 3. Dynamic Sequential Numbering
CREATE OR REPLACE FUNCTION public.generate_next_certificate_number(year_val INT)
RETURNS VARCHAR AS $$
DECLARE
  next_num INT;
  cert_num VARCHAR;
BEGIN
  -- Obtain transaction-level advisory lock to serialize concurrent sequence generation
  PERFORM pg_advisory_xact_lock(14820938);

  -- Extracts digits at the end of matching certificate numbers
  SELECT COALESCE(MAX(SUBSTRING(certificate_number FROM 10)::INT), 0) + 1
  INTO next_num
  FROM public.certificates
  WHERE certificate_number LIKE 'RCI-' || year_val || '-%';

  cert_num := 'RCI-' || year_val || '-' || LPAD(next_num::TEXT, 6, '0');
  RETURN cert_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_next_certificate_number()
RETURNS TRIGGER AS $$
DECLARE
  year_val INT;
BEGIN
  IF NEW.certificate_number IS NULL THEN
    year_val := SUBSTRING(NEW.issue_date::TEXT FROM 1 FOR 4)::INT;
    NEW.certificate_number := public.generate_next_certificate_number(year_val);
  END IF;
  
  -- Automatically generate verification token if null
  IF NEW.verification_token IS NULL THEN
    NEW.verification_token := encode(digest(NEW.certificate_number || random()::text, 'sha256'), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger for setting numbers
DROP TRIGGER IF EXISTS trg_set_certificate_number ON public.certificates;
CREATE TRIGGER trg_set_certificate_number
BEFORE INSERT ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.set_next_certificate_number();

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL, -- 'Generated', 'Downloaded', 'Printed', 'Reissued', 'Deleted', 'Verified'
  certificate_number VARCHAR(100),
  user_email VARCHAR(255),
  ip_address VARCHAR(45),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Row Level Security Policies
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Select policies
DROP POLICY IF EXISTS "Allow public read-only access to Valid certificates" ON public.certificates;
CREATE POLICY "Allow public read-only access to Valid certificates" ON public.certificates
  FOR SELECT USING (status = 'Valid');

DROP POLICY IF EXISTS "Allow authenticated users all access to certificates" ON public.certificates;
CREATE POLICY "Allow authenticated users all access to certificates" ON public.certificates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Audit log policies
DROP POLICY IF EXISTS "Allow anyone to insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow anyone to insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read audit logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated users to read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);

-- Profile policies
DROP POLICY IF EXISTS "Allow users to read their own profiles" ON public.user_profiles;
CREATE POLICY "Allow users to read their own profiles" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated to read all profiles" ON public.user_profiles;
CREATE POLICY "Allow authenticated to read all profiles" ON public.user_profiles
  FOR SELECT TO authenticated USING (true);

-- 6. Create Certificate Settings Table
CREATE TABLE IF NOT EXISTS public.certificate_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  institute_name VARCHAR(255) NOT NULL DEFAULT 'ROHIT COMPUTER INSTITUTE',
  director_name VARCHAR(100) NOT NULL DEFAULT 'Rohit Gupta',
  director_title VARCHAR(100) NOT NULL DEFAULT 'Director',
  msme_reg_no VARCHAR(100) NOT NULL DEFAULT 'UDYAM-UP-54-0023456',
  address TEXT NOT NULL DEFAULT 'Sanjay Nagar Cantt, Kanpur, UP — 208004',
  website VARCHAR(255) NOT NULL DEFAULT 'rciknp.vercel.app',
  phone VARCHAR(100) NOT NULL DEFAULT '+91 98765 43210',
  email VARCHAR(255) NOT NULL DEFAULT 'info@rciknp.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.certificate_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access to settings" ON public.certificate_settings;
CREATE POLICY "Allow public read-only access to settings" ON public.certificate_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users all access to settings" ON public.certificate_settings;
CREATE POLICY "Allow authenticated users all access to settings" ON public.certificate_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. RLS Policies for Students, Courses, and Admissions tables
-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Courses policies
DROP POLICY IF EXISTS "Allow public read-only access to courses" ON public.courses;
CREATE POLICY "Allow public read-only access to courses" ON public.courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users all access to courses" ON public.courses;
CREATE POLICY "Allow authenticated users all access to courses" ON public.courses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Students policies
DROP POLICY IF EXISTS "Allow authenticated users select access to students" ON public.students;
CREATE POLICY "Allow authenticated users select access to students" ON public.students
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users insert access to students" ON public.students;
CREATE POLICY "Allow authenticated users insert access to students" ON public.students
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users update access to students" ON public.students;
CREATE POLICY "Allow authenticated users update access to students" ON public.students
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users delete access to students" ON public.students;
CREATE POLICY "Allow authenticated users delete access to students" ON public.students
  FOR DELETE TO authenticated USING (true);

-- Admissions policies
GRANT ALL ON public.admissions TO anon, authenticated;
DROP POLICY IF EXISTS "Allow public to insert admissions" ON public.admissions;
CREATE POLICY "Allow public to insert admissions" ON public.admissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users select access to admissions" ON public.admissions;
CREATE POLICY "Allow authenticated users select access to admissions" ON public.admissions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users update access to admissions" ON public.admissions;
CREATE POLICY "Allow authenticated users update access to admissions" ON public.admissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users delete access to admissions" ON public.admissions;
CREATE POLICY "Allow authenticated users delete access to admissions" ON public.admissions
  FOR DELETE TO authenticated USING (true);

-- 8. Alter Courses Table for Enterprise LMS Features
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS slug VARCHAR(150),
  ADD COLUMN IF NOT EXISTS discount INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[],
  ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements TEXT[],
  ADD COLUMN IF NOT EXISTS eligibility TEXT,
  ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';

-- Ensure course slug is unique
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_slug_key;
ALTER TABLE public.courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);

-- Auto-slug generation function and trigger
CREATE OR REPLACE FUNCTION public.set_course_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.course_name, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '^-|-$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_course_slug ON public.courses;
CREATE TRIGGER trg_set_course_slug
BEFORE INSERT OR UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.set_course_slug();

-- 9. Create Notifications Table for in-app alert tracking and broadcast logs
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- References auth.users(id) if targeting specific profile
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'Email', 'WhatsApp', 'SMS', 'InApp'
  status VARCHAR(20) DEFAULT 'Pending', -- 'Sent', 'Failed', 'Read'
  metadata JSONB DEFAULT '{}'::jsonb, -- Custom payload logs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime publication for notifications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Enable RLS for notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
DROP POLICY IF EXISTS "Allow authenticated users to read notifications" ON public.notifications;
CREATE POLICY "Allow authenticated users to read notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (
    user_id IS NULL 
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.students s WHERE s.id = user_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_profiles p WHERE p.id = auth.uid() AND p.role IN ('Admin', 'Staff')
    )
  );

DROP POLICY IF EXISTS "Allow authenticated users to insert notifications" ON public.notifications;
CREATE POLICY "Allow authenticated users to insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update their own notifications" ON public.notifications;
CREATE POLICY "Allow authenticated users to update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 10. Add Notification Preferences to settings
ALTER TABLE public.certificate_settings
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"Email": true, "SMS": true, "WhatsApp": true, "InApp": true}'::jsonb;

-- 11. Fee Management Database Tables
CREATE TABLE IF NOT EXISTS public.fee_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  plan_name VARCHAR(100) NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  installments_count INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_fees_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  fee_plan_id UUID REFERENCES public.fee_plans(id) ON DELETE SET NULL,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status VARCHAR(20) CHECK (status IN ('Paid', 'Partial', 'Unpaid')) DEFAULT 'Unpaid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_id UUID REFERENCES public.student_fees_ledger(id) ON DELETE CASCADE,
  amount_paid NUMERIC NOT NULL,
  payment_mode VARCHAR(50) NOT NULL CHECK (payment_mode IN ('Cash', 'UPI', 'Card', 'NetBanking')),
  receipt_number VARCHAR(100) UNIQUE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for Authenticated Users (Admins and Staff can perform CRUD on fees)
DROP POLICY IF EXISTS "Allow authenticated users full access to fee_plans" ON public.fee_plans;
CREATE POLICY "Allow authenticated users full access to fee_plans" ON public.fee_plans
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to student_fees_ledger" ON public.student_fees_ledger;
CREATE POLICY "Allow authenticated users full access to student_fees_ledger" ON public.student_fees_ledger
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to fee_transactions" ON public.fee_transactions;
CREATE POLICY "Allow authenticated users full access to fee_transactions" ON public.fee_transactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Student Portal Schema Updates

-- Add is_read column to notifications (needed for student portal read tracking)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Attendance table (needed for student attendance tracking)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('Present', 'Absent', 'Leave')) DEFAULT 'Present',
  remarks VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Admins & staff can fully manage attendance
DROP POLICY IF EXISTS "Allow authenticated users full access to attendance" ON public.attendance;
CREATE POLICY "Allow authenticated users full access to attendance" ON public.attendance
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Exams table (needed for examination module)
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  exam_name VARCHAR(150) NOT NULL,
  max_marks INT NOT NULL DEFAULT 100,
  exam_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users full access to exams" ON public.exams;
CREATE POLICY "Allow authenticated users full access to exams" ON public.exams
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Exam results table
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC NOT NULL,
  grade VARCHAR(5) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(exam_id, student_id)
);
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users full access to exam_results" ON public.exam_results;
CREATE POLICY "Allow authenticated users full access to exam_results" ON public.exam_results
  FOR ALL TO authenticated USING (true) WITH CHECK (true);







