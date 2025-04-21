/*
  # Add Profile Fields

  1. Changes to Existing Tables
    - Add to `profiles` table:
      - `height` (integer)
      - `weight` (integer)
      - `blood_group` (text)
      - `allergies` (text)
      - `medications` (text)
      - `gender` (text)
      - `avatar_url` (text)
      - `walking_goal` (integer, default 10000)

  2. Security
    - Existing RLS policies will cover the new fields
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS height integer,
ADD COLUMN IF NOT EXISTS weight integer,
ADD COLUMN IF NOT EXISTS blood_group text,
ADD COLUMN IF NOT EXISTS allergies text,
ADD COLUMN IF NOT EXISTS medications text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS walking_goal integer DEFAULT 10000;