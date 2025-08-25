-- Run this in your Supabase SQL Editor to create storage bucket
-- Go to: https://supabase.com/dashboard/project/raklsftrjyrcsfkllequ/sql

-- Create storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for resume uploads
CREATE POLICY "Anyone can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resumes" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'resumes');
