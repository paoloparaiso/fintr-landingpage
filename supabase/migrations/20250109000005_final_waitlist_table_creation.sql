CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  finance_tracking_method TEXT[] DEFAULT '{}',
  custom_tracking_method TEXT,
  finance_app_name TEXT,
  money_frustration TEXT,
  desired_features TEXT,
  early_access_interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS waitlist_submissions_email_idx ON waitlist_submissions(email);
CREATE INDEX IF NOT EXISTS waitlist_submissions_created_at_idx ON waitlist_submissions(created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE waitlist_submissions;
