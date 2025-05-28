-- Fix RLS policies for waitlist_submissions table to allow anonymous insertions

-- Drop existing policies
DROP POLICY IF EXISTS "Allow inserts for everyone" ON waitlist_submissions;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON waitlist_submissions;
DROP POLICY IF EXISTS "Public access" ON waitlist_submissions;

-- Create a policy that allows anonymous users to insert data
CREATE POLICY "Allow anonymous inserts" ON waitlist_submissions 
FOR INSERT TO anon 
WITH CHECK (true);

-- Create a policy that allows authenticated users to insert data
CREATE POLICY "Allow authenticated inserts" ON waitlist_submissions 
FOR INSERT TO authenticated 
WITH CHECK (true);

-- Create a policy that allows service role to do everything
CREATE POLICY "Allow service role all access" ON waitlist_submissions 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

-- Create a policy that allows authenticated users to select data
CREATE POLICY "Allow authenticated select" ON waitlist_submissions 
FOR SELECT TO authenticated 
USING (true);

-- Create a policy that allows service role to select data
CREATE POLICY "Allow service role select" ON waitlist_submissions 
FOR SELECT TO service_role 
USING (true);
