-- Complete Supabase Schema for All Forms
-- Run these queries in your Supabase SQL Editor: https://supabase.com/dashboard/project/fqlvwhzkukqonvohhipc/sql

-- Enable Row Level Security (RLS) for better security
-- You can customize these policies based on your needs

-- =====================================================
-- 1. USERS TABLE (for authentication and profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- 2. CONTACTS TABLE (from Contact page form)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (admins only)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON public.contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts (email);

-- =====================================================
-- 3. JOB APPLICATIONS TABLE (from ApplicationModal)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT NOT NULL,
    experience TEXT NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own applications
CREATE POLICY "Users can insert applications" ON public.job_applications
    FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON public.job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON public.job_applications (status);
CREATE INDEX IF NOT EXISTS job_applications_email_idx ON public.job_applications (email);

-- =====================================================
-- 4. RESUME UPLOADS TABLE (from Careers page)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resume_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    position_interested TEXT,
    experience_level TEXT,
    skills TEXT,
    cover_letter TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resume_uploads ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS resume_uploads_created_at_idx ON public.resume_uploads (created_at DESC);
CREATE INDEX IF NOT EXISTS resume_uploads_email_idx ON public.resume_uploads (email);

-- =====================================================
-- 5. GET STARTED REQUESTS TABLE (from GetStarted page)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.get_started_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    job_title TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.get_started_requests ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS get_started_requests_created_at_idx ON public.get_started_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS get_started_requests_email_idx ON public.get_started_requests (email);

-- =====================================================
-- 6. NEWSLETTER SUBSCRIBERS TABLE (for Blogs newsletter)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON public.newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_active_idx ON public.newsletter_subscribers (is_active);

-- =====================================================
-- 7. STORAGE SETUP (for resume uploads)
-- =====================================================

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to resumes
CREATE POLICY "Public read access for resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- =====================================================
-- 8. ADMIN POLICIES (Optional - for admin access)
-- =====================================================

-- You can create admin policies for full access to all tables
-- Replace 'admin@yourdomain.com' with your admin email

-- Example admin policy for contacts (uncomment and modify as needed)
/*
CREATE POLICY "Admin full access to contacts" ON public.contacts
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'admin@yourdomain.com'
    );
*/

-- =====================================================
-- 9. FUNCTIONS AND TRIGGERS (Optional - for auto-updating timestamps)
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Test contact insertion
/*
INSERT INTO public.contacts (name, email, phone, company, message)
VALUES ('John Doe', 'john@example.com', '+1234567890', 'Tech Corp', 'Interested in your services');
*/

-- Test job application insertion
/*
INSERT INTO public.job_applications (full_name, email, phone, position, experience, status)
VALUES ('Jane Smith', 'jane@example.com', '+1234567890', 'Software Engineer', '3-5 years', 'pending');
*/

-- View all form submissions (admin query)
/*
-- Contacts
SELECT * FROM public.contacts ORDER BY created_at DESC;

-- Job Applications  
SELECT * FROM public.job_applications ORDER BY created_at DESC;

-- Resume Uploads
SELECT * FROM public.resume_uploads ORDER BY created_at DESC;

-- Get Started Requests
SELECT * FROM public.get_started_requests ORDER BY created_at DESC;

-- Newsletter Subscribers
SELECT * FROM public.newsletter_subscribers ORDER BY subscribed_at DESC;
*/
