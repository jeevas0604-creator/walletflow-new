-- Create savings_goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  target_amount numeric(12,2) NOT NULL,
  current_amount numeric(12,2) NOT NULL DEFAULT 0,
  target_date date,
  color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and policies for savings_goals
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can view their own savings goals'
  ) THEN
    CREATE POLICY "Users can view their own savings goals"
    ON public.savings_goals
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can insert their own savings goals'
  ) THEN
    CREATE POLICY "Users can insert their own savings goals"
    ON public.savings_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can update their own savings goals'
  ) THEN
    CREATE POLICY "Users can update their own savings goals"
    ON public.savings_goals
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can delete their own savings goals'
  ) THEN
    CREATE POLICY "Users can delete their own savings goals"
    ON public.savings_goals
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger for updated_at on savings_goals
DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON public.savings_goals;
CREATE TRIGGER update_savings_goals_updated_at
BEFORE UPDATE ON public.savings_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);


-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL, -- e.g., 'income' | 'expense' | 'transfer'
  category text,
  description text,
  account text,
  currency text DEFAULT 'INR',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  merchant text,
  tags text[] DEFAULT '{}'::text[]
);

-- Enable RLS and policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Users can view their own transactions'
  ) THEN
    CREATE POLICY "Users can view their own transactions"
    ON public.transactions
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Users can insert their own transactions'
  ) THEN
    CREATE POLICY "Users can insert their own transactions"
    ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Users can update their own transactions'
  ) THEN
    CREATE POLICY "Users can update their own transactions"
    ON public.transactions
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Users can delete their own transactions'
  ) THEN
    CREATE POLICY "Users can delete their own transactions"
    ON public.transactions
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger for updated_at on transactions
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_occurred_at ON public.transactions(user_id, occurred_at DESC);


-- Create shared_accounts table
CREATE TABLE IF NOT EXISTS public.shared_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  permission text NOT NULL DEFAULT 'view', -- 'view' | 'edit'
  status text NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined' | 'revoked'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and policies for shared_accounts
ALTER TABLE public.shared_accounts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'shared_accounts' AND policyname = 'Users can view their relevant shared accounts'
  ) THEN
    CREATE POLICY "Users can view their relevant shared accounts"
    ON public.shared_accounts
    FOR SELECT
    USING (auth.uid() IN (owner_user_id, target_user_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'shared_accounts' AND policyname = 'Owners can create shared accounts'
  ) THEN
    CREATE POLICY "Owners can create shared accounts"
    ON public.shared_accounts
    FOR INSERT
    WITH CHECK (auth.uid() = owner_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'shared_accounts' AND policyname = 'Participants can update shared accounts'
  ) THEN
    CREATE POLICY "Participants can update shared accounts"
    ON public.shared_accounts
    FOR UPDATE
    USING (auth.uid() IN (owner_user_id, target_user_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'shared_accounts' AND policyname = 'Owners can delete shared accounts'
  ) THEN
    CREATE POLICY "Owners can delete shared accounts"
    ON public.shared_accounts
    FOR DELETE
    USING (auth.uid() = owner_user_id);
  END IF;
END $$;

-- Trigger for updated_at on shared_accounts
DROP TRIGGER IF EXISTS update_shared_accounts_updated_at ON public.shared_accounts;
CREATE TRIGGER update_shared_accounts_updated_at
BEFORE UPDATE ON public.shared_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_shared_accounts_owner ON public.shared_accounts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_shared_accounts_target ON public.shared_accounts(target_user_id);