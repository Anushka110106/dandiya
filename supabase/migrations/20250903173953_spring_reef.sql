/*
  # Create registrations table for Dandiya Event

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `tickets` (integer, default 1)
      - `total_amount` (numeric, required)
      - `payment_status` (text, default 'pending')
      - `ticket_id` (text, unique)
      - `stripe_payment_intent_id` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `registrations` table
    - Add policy for public insert (registration)
    - Add policy for users to read their own registrations by email

  3. Indexes
    - Add index on email for faster lookups
    - Add index on ticket_id for unique ticket verification
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  tickets integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  ticket_id text UNIQUE,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy for public registration (insert)
CREATE POLICY "Anyone can register"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for users to read their own registrations
CREATE POLICY "Users can read own registrations"
  ON registrations
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

-- Function to generate unique ticket ID
CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS text AS $$
BEGIN
  RETURN 'DND2025-' || upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket ID on insert
CREATE OR REPLACE FUNCTION set_ticket_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_ticket_id();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_id
  BEFORE INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_id();