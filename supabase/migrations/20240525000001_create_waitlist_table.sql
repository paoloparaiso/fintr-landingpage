CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  financial_goals TEXT[] DEFAULT '{}',
  current_tracking TEXT,
  challenges TEXT[] DEFAULT '{}',
  useful_features TEXT[] DEFAULT '{}',
  platform TEXT,
  check_frequency TEXT,
  premium_willingness TEXT,
  concerns TEXT[] DEFAULT '{}',
  early_access TEXT,
  stay_connected TEXT,
  custom_financial_goals TEXT,
  custom_challenges TEXT,
  custom_features TEXT,
  custom_concerns TEXT,
  premium_amount TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table waitlist_submissions;
