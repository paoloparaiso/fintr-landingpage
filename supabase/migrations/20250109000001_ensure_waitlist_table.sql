CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  finance_tracking_method text[] NULL,
  custom_tracking_method text NULL,
  finance_app_name text NULL,
  money_frustration text NULL,
  desired_features text NULL,
  early_access_interest text NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table waitlist_submissions;
