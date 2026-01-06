-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 1,
  budget TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Users can view their own itineraries
CREATE POLICY "Users can view their own itineraries"
ON public.itineraries
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own itineraries
CREATE POLICY "Users can create their own itineraries"
ON public.itineraries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own itineraries
CREATE POLICY "Users can delete their own itineraries"
ON public.itineraries
FOR DELETE
USING (auth.uid() = user_id);