-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  amount DECIMAL NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  amount DECIMAL NOT NULL,
  period TEXT NOT NULL, -- 'monthly', 'yearly', etc.
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL NOT NULL DEFAULT 0,
  target_date DATE NOT NULL,
  category TEXT NOT NULL, -- 'short-term', 'medium-term', 'long-term'
  priority TEXT NOT NULL, -- 'high', 'medium', 'low'
  monthly_contribution DECIMAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see and modify their own data
DROP POLICY IF EXISTS "Users can only see their own data" ON users;
CREATE POLICY "Users can only see their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can only modify their own data" ON users;
CREATE POLICY "Users can only modify their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
DROP POLICY IF EXISTS "Users can only see their own categories" ON categories;
CREATE POLICY "Users can only see their own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own categories" ON categories;
CREATE POLICY "Users can only insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own categories" ON categories;
CREATE POLICY "Users can only update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own categories" ON categories;
CREATE POLICY "Users can only delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions policies
DROP POLICY IF EXISTS "Users can only see their own transactions" ON transactions;
CREATE POLICY "Users can only see their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own transactions" ON transactions;
CREATE POLICY "Users can only insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own transactions" ON transactions;
CREATE POLICY "Users can only update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own transactions" ON transactions;
CREATE POLICY "Users can only delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Budgets policies
DROP POLICY IF EXISTS "Users can only see their own budgets" ON budgets;
CREATE POLICY "Users can only see their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own budgets" ON budgets;
CREATE POLICY "Users can only insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own budgets" ON budgets;
CREATE POLICY "Users can only update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own budgets" ON budgets;
CREATE POLICY "Users can only delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Goals policies
DROP POLICY IF EXISTS "Users can only see their own goals" ON goals;
CREATE POLICY "Users can only see their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own goals" ON goals;
CREATE POLICY "Users can only insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own goals" ON goals;
CREATE POLICY "Users can only update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own goals" ON goals;
CREATE POLICY "Users can only delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table budgets;
alter publication supabase_realtime add table goals;