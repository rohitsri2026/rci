-- ============================================================
-- RCI CMS — WEBSITE ANNOUNCEMENTS V3 MIGRATION
-- Adds display_format (presentation style) column idempotently
-- ============================================================

-- 1. Add display_format column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'website_announcements' AND column_name = 'display_format'
  ) THEN
    ALTER TABLE public.website_announcements 
    ADD COLUMN display_format TEXT NOT NULL DEFAULT 'top_strip';
  END IF;
END $$;

-- 2. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
