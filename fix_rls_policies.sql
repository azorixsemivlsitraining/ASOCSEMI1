-- Fix Row Level Security Policies for Public Forms
-- Run this in your Supabase SQL Editor to fix the RLS issues

-- =====================================================
-- 1. FIX CONTACTS TABLE - Allow public submissions
-- =====================================================

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.contacts;
DROP POLICY IF EXISTS "Users can update own profile" ON public.contacts;

-- Allow anyone to insert contact form submissions
CREATE POLICY "Anyone can submit contact forms" ON public.contacts
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users and admins to view contacts
CREATE POLICY "Authenticated users can view contacts" ON public.contacts
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. FIX RESUME UPLOADS TABLE - Allow public submissions  
-- =====================================================

-- Allow anyone to submit resume uploads
CREATE POLICY "Anyone can submit resumes" ON public.resume_uploads
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view resume uploads
CREATE POLICY "Authenticated users can view resumes" ON public.resume_uploads
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. FIX GET STARTED REQUESTS TABLE - Allow public submissions
-- =====================================================

-- Allow anyone to submit get started requests
CREATE POLICY "Anyone can submit get started requests" ON public.get_started_requests
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view get started requests
CREATE POLICY "Authenticated users can view get started requests" ON public.get_started_requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. FIX NEWSLETTER SUBSCRIPTIONS - Allow public submissions
-- =====================================================

-- Allow anyone to subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view newsletter subscribers
CREATE POLICY "Authenticated users can view newsletter subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. ADMIN ACCESS POLICIES (Optional)
-- =====================================================

-- Create admin policies for full access to all tables
-- Replace 'admin@yourdomain.com' with your admin email or use a role-based approach

-- Example: Admin can do everything on contacts
CREATE POLICY "Admin full access to contacts" ON public.contacts
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'admin@asocsemi.com' OR
        auth.jwt() ->> 'email' = 'careers@asocsemi.com'
    );

-- Example: Admin can do everything on resume uploads
CREATE POLICY "Admin full access to resume uploads" ON public.resume_uploads
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'admin@asocsemi.com' OR
        auth.jwt() ->> 'email' = 'careers@asocsemi.com'
    );

-- Example: Admin can do everything on get started requests
CREATE POLICY "Admin full access to get started requests" ON public.get_started_requests
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'admin@asocsemi.com' OR
        auth.jwt() ->> 'email' = 'careers@asocsemi.com'
    );

-- =====================================================
-- 6. VERIFY POLICIES ARE WORKING
-- =====================================================

-- Test queries to verify the policies work:

-- Test public insert (should work)
/*
INSERT INTO public.contacts (name, email, message) 
VALUES ('Test User', 'test@example.com', 'Test message');
*/

-- Test public insert for resume uploads (should work)
/*
INSERT INTO public.resume_uploads (full_name, email) 
VALUES ('Test User', 'test@example.com');
*/

-- Test public insert for get started requests (should work)
/*
INSERT INTO public.get_started_requests (first_name, last_name, email) 
VALUES ('Test', 'User', 'test@example.com');
*/

-- View tables (should work for authenticated users)
/*
SELECT * FROM public.contacts LIMIT 1;
SELECT * FROM public.resume_uploads LIMIT 1;
SELECT * FROM public.get_started_requests LIMIT 1;
*/
