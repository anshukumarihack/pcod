/*
  # Revert period tracking schema changes

  1. Changes
    - Modify period_tracking table to revert back to original structure:
      - Keep basic fields: cycle_start_date, cycle_end_date, symptoms, notes
      - Remove any additional fields that were added

  2. Security
    - Maintain existing RLS policies
*/

-- Ensure the table exists with original structure
CREATE TABLE IF NOT EXISTS period_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  cycle_start_date date NOT NULL,
  cycle_end_date date,
  symptoms text[],
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE period_tracking ENABLE ROW LEVEL SECURITY;

-- Recreate the RLS policy
DROP POLICY IF EXISTS "Users can manage their own period tracking data" ON period_tracking;
CREATE POLICY "Users can manage their own period tracking data"
  ON period_tracking
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);