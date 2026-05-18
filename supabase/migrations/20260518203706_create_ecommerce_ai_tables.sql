/*
  # E-Commerce AI Suite - Database Schema

  ## New Tables

  ### 1. `ai_queries`
  Stores all AI query history for analytics.
  - `id` (uuid, primary key)
  - `session_id` (text) - anonymous session identifier
  - `module` (text) - which module was used: 'product_assistant', 'review_analyzer', 'description_generator'
  - `input` (text) - user input
  - `output` (jsonb) - AI response
  - `created_at` (timestamptz)

  ### 2. `product_searches`
  Tracks product search queries for trending analysis.
  - `id` (uuid, primary key)
  - `query` (text) - search query
  - `budget` (text)
  - `category` (text)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Anonymous insert allowed (session-based)
  - No read access for unauthenticated users (privacy)
*/

CREATE TABLE IF NOT EXISTS ai_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  module text NOT NULL DEFAULT 'product_assistant',
  input text NOT NULL DEFAULT '',
  output jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL DEFAULT '',
  budget text DEFAULT '',
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ai_queries"
  ON ai_queries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert product_searches"
  ON product_searches FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS ai_queries_module_idx ON ai_queries(module);
CREATE INDEX IF NOT EXISTS ai_queries_created_at_idx ON ai_queries(created_at DESC);
