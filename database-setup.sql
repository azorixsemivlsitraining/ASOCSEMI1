-- =====================================================
-- SUPABASE DATABASE SETUP FOR FORMS
-- Project: qerwetgfkkxaowdfnuwt
-- =====================================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- =====================================================
-- 1. CONTACTS TABLE (Contact Form Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contacts
CREATE POLICY "Allow anonymous contact submissions" ON public.contacts
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow authenticated users to view all contacts
CREATE POLICY "Allow authenticated users to view contacts" ON public.contacts
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated users to update contact status
CREATE POLICY "Allow authenticated users to update contacts" ON public.contacts
    FOR UPDATE TO authenticated
    USING (true);

-- =====================================================
-- 2. JOB APPLICATIONS TABLE (Career Form Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    position VARCHAR(255) NOT NULL,
    experience TEXT NOT NULL,
    skills TEXT[],
    resume_url TEXT,
    cover_letter TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own applications
CREATE POLICY "Users can insert their own applications" ON public.job_applications
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous job applications
CREATE POLICY "Allow anonymous job applications" ON public.job_applications
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications" ON public.job_applications
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications" ON public.job_applications
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%admin%'
        )
    );

-- Allow admins to update applications
CREATE POLICY "Admins can update applications" ON public.job_applications
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%admin%'
        )
    );

-- =====================================================
-- 3. USER PROFILES TABLE (Extended User Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    company VARCHAR(255),
    position VARCHAR(255),
    phone VARCHAR(50),
    bio TEXT,
    website TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- 4. NEWSLETTER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website'
);

-- RLS Policies for newsletter
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous subscriptions
CREATE POLICY "Allow anonymous newsletter subscriptions" ON public.newsletter_subscriptions
    FOR INSERT TO anon
    WITH CHECK (true);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON public.job_applications(position);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);

-- =====================================================
-- 6. CREATE UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. USEFUL QUERIES FOR ADMIN DASHBOARD
-- =====================================================

-- Get all recent contacts (last 30 days)
-- SELECT * FROM public.contacts 
-- WHERE created_at >= NOW() - INTERVAL '30 days'
-- ORDER BY created_at DESC;

-- Get job applications by status
-- SELECT position, status, COUNT(*) as count
-- FROM public.job_applications
-- GROUP BY position, status
-- ORDER BY position, status;

-- Get contact form submissions by month
-- SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as submissions
-- FROM public.contacts
-- WHERE created_at >= NOW() - INTERVAL '12 months'
-- GROUP BY month
-- ORDER BY month DESC;

-- Get most applied positions
-- SELECT position, COUNT(*) as applications
-- FROM public.job_applications
-- GROUP BY position
-- ORDER BY applications DESC;

-- =====================================================
-- 8. STORAGE BUCKETS FOR FILE UPLOADS
-- =====================================================

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
CREATE POLICY "Allow authenticated uploads to resumes" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow users to view their own resumes" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars
CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public viewing of avatars" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'avatars');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
