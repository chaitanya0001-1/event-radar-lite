-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  current_participants INTEGER NOT NULL DEFAULT 0 CHECK (current_participants >= 0 AND current_participants <= max_participants),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to events"
  ON public.events
  FOR SELECT
  USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert to events"
  ON public.events
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update
CREATE POLICY "Allow public update to events"
  ON public.events
  FOR UPDATE
  USING (true);

-- Create index for location-based queries
CREATE INDEX idx_events_location ON public.events(location);

-- Create index for date queries
CREATE INDEX idx_events_date ON public.events(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();