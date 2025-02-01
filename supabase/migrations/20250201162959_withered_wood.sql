/*
  # Create FAQs table with translations support

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `translations` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `faqs` table
    - Add policies for authenticated users to manage FAQs
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  translations jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "FAQs are viewable by everyone" 
  ON faqs 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow authenticated users to manage FAQs
CREATE POLICY "Authenticated users can insert FAQs" 
  ON faqs 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQs" 
  ON faqs 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQs" 
  ON faqs 
  FOR DELETE 
  TO authenticated 
  USING (true);