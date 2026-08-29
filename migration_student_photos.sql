-- Migration Script for RCI Student Profile Photo System
-- Run this in your Supabase SQL Editor

-- 1. Add photo_url column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS photo_url TEXT NULL;

-- 2. Create student-photos storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security Policies for Storage Objects in 'student-photos' bucket

-- Public Read-Only Access for Student Photos (Required for certificate verification & portal)
DROP POLICY IF EXISTS "Public Read Access for student-photos" ON storage.objects;
CREATE POLICY "Public Read Access for student-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'student-photos');

-- Authenticated Users Upload/Manage Access
DROP POLICY IF EXISTS "Authenticated Admin Upload for student-photos" ON storage.objects;
CREATE POLICY "Authenticated Admin Upload for student-photos" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'student-photos') 
  WITH CHECK (bucket_id = 'student-photos');
