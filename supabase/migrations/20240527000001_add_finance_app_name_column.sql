-- Add finance_app_name column to waitlist_submissions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'waitlist_submissions'
        AND column_name = 'finance_app_name'
    ) THEN
        ALTER TABLE waitlist_submissions ADD COLUMN finance_app_name TEXT;
    END IF;
END $$;