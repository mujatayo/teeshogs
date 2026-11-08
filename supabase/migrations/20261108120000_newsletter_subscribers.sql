/*
  Newsletter subscribers for storefront popup + footer signup.
  - Public can insert (subscribe)
  - Admins can read / update / delete
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'popup'
    CHECK (source IN ('popup', 'footer', 'checkout', 'other')),
  status text NOT NULL DEFAULT 'subscribed'
    CHECK (status IN ('subscribed', 'unsubscribed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_not_blank CHECK (length(trim(email)) > 0)
);

-- Emails are normalized to lowercase in the trigger, so a plain unique works.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique
  ON newsletter_subscribers (email);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
  ON newsletter_subscribers (created_at DESC);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON newsletter_subscribers (status);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_insert_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "anyone_insert_newsletter_subscribers"
ON newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admins_select_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "admins_select_newsletter_subscribers"
ON newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "admins_update_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "admins_update_newsletter_subscribers"
ON newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admins_delete_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "admins_delete_newsletter_subscribers"
ON newsletter_subscribers
FOR DELETE
TO authenticated
USING (public.is_admin());

GRANT ALL ON TABLE public.newsletter_subscribers TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_newsletter_subscribers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS newsletter_subscribers_set_updated_at ON newsletter_subscribers;
CREATE TRIGGER newsletter_subscribers_set_updated_at
BEFORE INSERT OR UPDATE ON newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.set_newsletter_subscribers_updated_at();
