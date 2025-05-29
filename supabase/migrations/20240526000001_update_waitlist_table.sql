-- Update the waitlist_submissions table with the new fields
ALTER TABLE waitlist_submissions
DROP COLUMN IF EXISTS financial_goals,
DROP COLUMN IF EXISTS current_tracking,
DROP COLUMN IF EXISTS challenges,
DROP COLUMN IF EXISTS useful_features,
DROP COLUMN IF EXISTS platform,
DROP COLUMN IF EXISTS check_frequency,
DROP COLUMN IF EXISTS premium_willingness,
DROP COLUMN IF EXISTS concerns,
DROP COLUMN IF EXISTS early_access,
DROP COLUMN IF EXISTS stay_connected,
DROP COLUMN IF EXISTS custom_financial_goals,
DROP COLUMN IF EXISTS custom_challenges,
DROP COLUMN IF EXISTS custom_features,
DROP COLUMN IF EXISTS custom_concerns,
DROP COLUMN IF EXISTS premium_amount;

-- Add the new columns
ALTER TABLE waitlist_submissions
ADD COLUMN IF NOT EXISTS finance_tracking_method text[] NULL,
ADD COLUMN IF NOT EXISTS custom_tracking_method text NULL,
ADD COLUMN IF NOT EXISTS money_frustration text NULL,
ADD COLUMN IF NOT EXISTS desired_features text NULL,
ADD COLUMN IF NOT EXISTS early_access_interest text NULL;
