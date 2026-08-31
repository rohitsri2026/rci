-- ============================================================
-- RCI CMS — WEBSITE ANNOUNCEMENTS V2 MIGRATION
-- Adds display_on (targeting) and no_expiry columns idempotently
-- ============================================================

-- 1. Add display_on column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'website_announcements' AND column_name = 'display_on'
  ) THEN
    ALTER TABLE public.website_announcements 
    ADD COLUMN display_on TEXT NOT NULL DEFAULT 'global';
  END IF;
END $$;

-- 2. Add no_expiry column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'website_announcements' AND column_name = 'no_expiry'
  ) THEN
    ALTER TABLE public.website_announcements 
    ADD COLUMN no_expiry BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- 3. Create index for target filtering
CREATE INDEX IF NOT EXISTS idx_website_announcements_display_on 
ON public.website_announcements(display_on);

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
