/*
  # Add Profile Fields

  1. Changes to Existing Tables
    - Add to `profiles` table:
      - `allergies` (text)
      - `avatar_url` (text)

  2. Security
    - Existing RLS policies will cover the new fields
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'allergies'
  ) THEN
    ALTER TABLE profiles ADD COLUMN allergies text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;