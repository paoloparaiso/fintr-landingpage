-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table if it doesn't exist
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Transactions policies
DROP POLICY IF EXISTS "Users can only see their own transactions" ON transactions;
CREATE POLICY "Users can only see their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only insert their own transactions" ON transactions;
CREATE POLICY "Users can only insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only update their own transactions" ON transactions;
CREATE POLICY "Users can only update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only delete their own transactions" ON transactions;
CREATE POLICY "Users can only delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

-- Categories policies
DROP POLICY IF EXISTS "Users can only see their own categories" ON categories;
CREATE POLICY "Users can only see their own categories"
  ON categories FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only insert their own categories" ON categories;
CREATE POLICY "Users can only insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only update their own categories" ON categories;
CREATE POLICY "Users can only update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only delete their own categories" ON categories;
CREATE POLICY "Users can only delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

-- Budgets policies
DROP POLICY IF EXISTS "Users can only see their own budgets" ON budgets;
CREATE POLICY "Users can only see their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only insert their own budgets" ON budgets;
CREATE POLICY "Users can only insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only update their own budgets" ON budgets;
CREATE POLICY "Users can only update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

DROP POLICY IF EXISTS "Users can only delete their own budgets" ON budgets;
CREATE POLICY "Users can only delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid()::text = user_id OR user_id = 'current-user-id');

-- Enable realtime subscriptions
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table budgets;