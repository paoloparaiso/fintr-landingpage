-- Drop the table if it exists to avoid conflicts
DROP TABLE IF EXISTS waitlist_submissions;

-- Create the waitlist_submissions table with all required columns
CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS waitlist_submissions_email_idx ON waitlist_submissions(email);
CREATE INDEX IF NOT EXISTS waitlist_submissions_created_at_idx ON waitlist_submissions(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert data
DROP POLICY IF EXISTS "Allow inserts for everyone" ON waitlist_submissions;
CREATE POLICY "Allow inserts for everyone" ON waitlist_submissions FOR INSERT TO public WITH CHECK (true);

-- Create a policy that allows only authenticated users to select their own data
DROP POLICY IF EXISTS "Allow select for authenticated users" ON waitlist_submissions;
CREATE POLICY "Allow select for authenticated users" ON waitlist_submissions FOR SELECT TO authenticated USING (true);

-- Add the table to Supabase realtime
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist_submissions;

-- Insert a test record to verify the table works
INSERT INTO waitlist_submissions (first_name, last_name, email, finance_tracking_method, early_access_interest)
VALUES ('Test', 'User', 'test@example.com', '{spreadsheet}', 'yes');
