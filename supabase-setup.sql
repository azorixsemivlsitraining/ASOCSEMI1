-- Run this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/raklsftrjyrcsfkllequ/sql

-- Create contacts table for contact form
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table for career form
CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    experience TEXT NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for form submissions)
CREATE POLICY "Allow public inserts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.job_applications FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated reads" ON public.job_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated updates" ON public.job_applications FOR UPDATE TO authenticated USING (true);
