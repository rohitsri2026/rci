-- ============================================================
-- RCI CMS — WEBSITE ANNOUNCEMENTS & NOTICES SCHEMA MIGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.website_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'notice', -- notice, important, admission, exam, fee, event, update, certificate, material
  priority TEXT NOT NULL DEFAULT 'normal', -- normal, important, urgent
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_at TIMESTAMPTZ,
  button_text TEXT,
  button_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_dismissible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_website_announcements_enabled ON public.website_announcements(is_enabled);
CREATE INDEX IF NOT EXISTS idx_website_announcements_schedule ON public.website_announcements(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_website_announcements_priority_order ON public.website_announcements(priority, display_order);

-- Enable RLS
ALTER TABLE public.website_announcements ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'website_announcements' AND policyname = 'Public read active website announcements'
  ) THEN
    CREATE POLICY "Public read active website announcements"
      ON public.website_announcements FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin Write Policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'website_announcements' AND policyname = 'Admin write website announcements'
  ) THEN
    CREATE POLICY "Admin write website announcements"
      ON public.website_announcements FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Idempotently copy existing single announcement_settings record if website_announcements is empty
DO $$
DECLARE
  existing_count INTEGER;
  old_msg TEXT;
  old_link_text TEXT;
  old_link_url TEXT;
  old_enabled BOOLEAN;
  old_start TIMESTAMPTZ;
  old_end TIMESTAMPTZ;
BEGIN
  SELECT COUNT(*) INTO existing_count FROM public.website_announcements;
  
  IF existing_count = 0 THEN
    SELECT message, link_text, link_url, is_enabled, start_at, end_at
    INTO old_msg, old_link_text, old_link_url, old_enabled, old_start, old_end
    FROM public.announcement_settings
    WHERE id = 'default'
    LIMIT 1;

    IF old_msg IS NOT NULL AND old_msg <> '' THEN
      INSERT INTO public.website_announcements (
        title,
        message,
        announcement_type,
        priority,
        is_enabled,
        start_at,
        end_at,
        button_text,
        button_url,
        display_order,
        is_dismissible
      ) VALUES (
        'Important Announcement',
        old_msg,
        'admission',
        'important',
        COALESCE(old_enabled, true),
        COALESCE(old_start, now()),
        old_end,
        old_link_text,
        old_link_url,
        1,
        true
      );
    END IF;
  END IF;
END $$;
