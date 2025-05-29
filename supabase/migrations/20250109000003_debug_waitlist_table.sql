-- Debug and recreate waitlist_submissions table
-- First, let's check if the table exists and drop it if it does
DROP TABLE IF EXISTS public.waitlist_submissions CASCADE;

-- Create the waitlist_submissions table with proper schema
CREATE TABLE public.waitlist_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    finance_tracking_method TEXT[] DEFAULT '{}',
    custom_tracking_method TEXT,
    finance_app_name TEXT,
    money_frustration TEXT,
    desired_features TEXT,
    early_access_interest TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security) - disabled by default as requested
ALTER TABLE public.waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy for public access (since RLS is enabled)
DROP POLICY IF EXISTS "Public access" ON public.waitlist_submissions;
CREATE POLICY "Public access"
ON public.waitlist_submissions FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.waitlist_submissions;

-- Create an index on email for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_submissions_email ON public.waitlist_submissions(email);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_submissions_created_at ON public.waitlist_submissions(created_at);

-- Insert a test record to verify the table works
INSERT INTO public.waitlist_submissions (
    first_name,
    last_name,
    email,
    finance_tracking_method,
    early_access_interest
) VALUES (
    'Test',
    'User',
    'test@example.com',
    ARRAY['dont_track'],
    'yes'
) ON CONFLICT (email) DO NOTHING;