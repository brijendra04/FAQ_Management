/*
  # Add missing components to FAQs table

  1. Changes
    - Add any missing components to the FAQs table structure
    - Skip policy creation since they already exist
*/

-- Create table if it doesn't exist (safe to repeat)
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  translations jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled (safe to repeat)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;