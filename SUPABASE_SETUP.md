# Complete Supabase Integration Setup Guide

This guide will help you set up Supabase with authentication, database, and file storage for the ASOCSEMI application.

## 1. Connect Supabase MCP Integration

**First, connect to Supabase through Builder.io:**

- Click [Open MCP popover](#open-mcp-popover)
- Find and connect **Supabase** from the available integrations
- This will give you direct access to manage your Supabase project

## 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose your organization and project name: `asocsemi-app`
3. Select a region close to your users
4. Set a strong database password

## 3. Get Your Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (keep this secret!)

## 4. Configure Environment Variables

Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Or use DevServerControl to set environment variables securely:**

- This is recommended for sensitive data like API keys

## 5. Database Schema Setup

Run these SQL commands in your Supabase SQL Editor:

### Enable Row Level Security and Create Tables

```sql
-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Set up Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Contacts table policies (anyone can insert, admins can view)
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contacts" ON contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%admin%'
    )
  );

-- Job applications policies
CREATE POLICY "Anyone can insert applications" ON job_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%admin%'
    )
  );

CREATE POLICY "Admins can update applications" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%admin%'
    )
  );
```

## 6. Set up File Storage

### Create Storage Bucket for Resumes

```sql
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Set up storage policies
CREATE POLICY "Anyone can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Admins can delete resumes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%admin%'
    )
  );
```

## 7. Configure Authentication Providers

### Google OAuth Setup

1. Go to **Authentication** → **Settings** in Supabase
2. Find **Google** provider and enable it
3. Get Google OAuth credentials:

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create/select a project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Add `https://your-project-id.supabase.co/auth/v1/callback` to redirect URIs

4. Add your Google OAuth credentials to Supabase:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret

### Facebook OAuth Setup

1. Enable **Facebook** provider in Supabase
2. Get Facebook OAuth credentials:

   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create a new app
   - Add Facebook Login product
   - Get App ID and App Secret
   - Add `https://your-project-id.supabase.co/auth/v1/callback` to redirect URIs

3. Add your Facebook OAuth credentials to Supabase:
   - **App ID**: Your Facebook App ID
   - **App Secret**: Your Facebook App Secret

## 8. Test the Integration

### Test Authentication

1. Visit `/login` page
2. Try signing up with email
3. Test Google OAuth login
4. Test Facebook OAuth login

### Test Contact Form

1. Visit `/contact` page
2. Fill out and submit the form
3. Check Supabase database for the record

### Test Job Applications

1. Visit `/careers` page
2. Click "Apply Now" on any job
3. Fill out the application form
4. Upload a resume (PDF/DOC/DOCX)
5. Submit the application

### Test Admin Dashboard

1. Create an admin user (email containing "admin")
2. Visit `/admin` page
3. View applications and contacts
4. Update application status
5. Download resumes

## 9. Security Considerations

1. **Environment Variables**: Never commit real credentials to version control
2. **Row Level Security**: All tables have RLS enabled with appropriate policies
3. **File Upload**: Resume uploads are restricted to specific file types
4. **Admin Access**: Admin features are protected by email-based checks
5. **CORS**: Configure allowed origins in Supabase settings

## 10. Deployment Notes

- Set environment variables in your deployment platform
- Ensure your domain is added to Supabase allowed origins
- Update OAuth provider redirect URIs for production domain
- Consider using Netlify or Vercel MCP integrations for easy deployment

## Troubleshooting

### Common Issues

1. **"Invalid JWT"**: Check your environment variables are set correctly
2. **"Row Level Security"**: Ensure RLS policies are created and user has proper permissions
3. **OAuth redirect mismatch**: Verify redirect URIs in OAuth provider settings
4. **File upload fails**: Check storage bucket exists and policies are set
5. **Admin access denied**: Ensure user email contains "admin"

### Database Reset

If you need to reset your database:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then re-run the schema setup above
```

## Support

For issues specific to this integration:

1. Check the browser console for error messages
2. Verify Supabase dashboard for data and logs
3. Test with Supabase's built-in API documentation
4. Use the connected Supabase MCP integration for direct database management

The application is now fully integrated with Supabase for authentication, data storage, and file management!
