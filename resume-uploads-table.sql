-- Create separate resume_uploads table for "Send Your Resume" functionality
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.resume_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    position_interested TEXT,
    experience_level TEXT,
    skills TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resume_uploads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for form submissions)
CREATE POLICY "Allow public resume uploads" ON public.resume_uploads 
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (for HR team)
CREATE POLICY "Allow authenticated reads resume uploads" ON public.resume_uploads 
FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS resume_uploads_created_at_idx ON public.resume_uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS resume_uploads_email_idx ON public.resume_uploads(email);
CREATE INDEX IF NOT EXISTS resume_uploads_position_idx ON public.resume_uploads(position_interested);
