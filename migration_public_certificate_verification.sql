-- ==============================================================================
-- RCI SECURITY HARDENING: PUBLIC CERTIFICATE VERIFICATION LAYER
-- Migration file: migration_public_certificate_verification.sql
-- ==============================================================================
-- Purpose:
-- 1. Remove broad public read policy on public.students table to protect private data
--    (phone, email, address, fee records, etc.) from unauthorized public queries.
-- 2. Restore strict RLS policy on public.students for authenticated users only.
-- 3. Create a SECURITY DEFINER PostgreSQL RPC function (get_public_certificate_verification)
--    that returns ONLY public-safe fields (certificate details, student full_name, photo_url,
--    course program details) for valid certificates.
-- 4. Grant execution permissions on the RPC function to anon and authenticated roles.
-- ==============================================================================

-- 1. RESTRICT RLS POLICY ON public.students TABLE
-- Remove broad public read policy if present
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;

-- Restore policy allowing only authenticated users to SELECT from public.students directly
DROP POLICY IF EXISTS "Allow authenticated users select access to students" ON public.students;
CREATE POLICY "Allow authenticated users select access to students" ON public.students
  FOR SELECT TO authenticated USING (true);


-- 2. CREATE PUBLIC CERTIFICATE VERIFICATION SECURITY DEFINER RPC FUNCTION
CREATE OR REPLACE FUNCTION public.get_public_certificate_verification(p_certificate_id text)
RETURNS TABLE (
  id uuid,
  certificate_number varchar,
  status varchar,
  issue_date date,
  completion_date date,
  grade varchar,
  verification_token varchar,
  certificate_pdf_url text,
  student_name text,
  course_name text,
  students jsonb,
  courses jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_id text;
BEGIN
  -- Normalize input certificate ID (trim whitespace and convert to uppercase)
  v_clean_id := UPPER(TRIM(COALESCE(p_certificate_id, '')));

  IF v_clean_id = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    c.id,
    c.certificate_number,
    c.status,
    c.issue_date,
    c.completion_date,
    c.grade,
    c.verification_token,
    c.certificate_pdf_url,
    COALESCE(s.full_name, c.student_name, '—')::text AS student_name,
    COALESCE(co.course_name, c.course_name, '—')::text AS course_name,
    CASE 
      WHEN s.id IS NOT NULL THEN jsonb_build_object(
        'id', s.id,
        'full_name', s.full_name,
        'photo_url', s.photo_url
      )
      ELSE NULL
    END AS students,
    CASE 
      WHEN co.id IS NOT NULL THEN jsonb_build_object(
        'id', co.id,
        'course_name', co.course_name,
        'duration', co.duration,
        'fees', co.fees
      )
      ELSE NULL
    END AS courses
  FROM public.certificates c
  LEFT JOIN public.students s ON s.id = c.student_id
  LEFT JOIN public.courses co ON co.id = c.course_id
  WHERE UPPER(TRIM(c.certificate_number)) = v_clean_id
  LIMIT 1;
END;
$$;

-- 3. GRANT EXECUTE PERMISSION TO PUBLIC (ANON & AUTHENTICATED ROLES)
GRANT EXECUTE ON FUNCTION public.get_public_certificate_verification(text) TO anon, authenticated;

-- Comment describing the function's security boundary
COMMENT ON FUNCTION public.get_public_certificate_verification(text) IS
'Public-safe certificate verification RPC function. Returns only certificate details, student name, and student photo_url for public verification without exposing private student records (phone, email, address, etc.).';
