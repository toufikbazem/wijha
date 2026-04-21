-- Seed subscription_plans table with initial plans
-- Run this in Supabase SQL editor after creating the tables

INSERT INTO subscription_plans (name, type, duration, price, job_post_limit, profile_access_limit)
VALUES
  ('Free',       'free',      30,    0,     2,    5),
  ('Starter',    'pack',      30,    2900,  10,   30),
  ('Business',   'pack',      30,    7900,  30,   100),
  ('Unlimited',  'unlimited', 30,    14900, NULL, NULL)
ON CONFLICT DO NOTHING;
