# Supabase Database Setup Guide

## Current Issue

The admin dashboard is showing zero data even though forms are configured to submit to Supabase. This suggests the Supabase tables may not exist or have RLS policies blocking access.

## Required Tables

You need to create these tables in your Supabase database:

### 1. contacts

```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. job_applications

```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. get_started_requests

```sql
CREATE TABLE get_started_requests (
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
```

### 4. resume_uploads

```sql
CREATE TABLE resume_uploads (
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
```

### 5. newsletter_subscribers

```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## Row Level Security (RLS) Policies

After creating tables, you need to set up RLS policies. For development, you can temporarily disable RLS:

```sql
-- Disable RLS for development (re-enable for production)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE get_started_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE resume_uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
```

## How to Set Up

1. **Go to Supabase Dashboard**: https://app.supabase.com/project/fqlvwhzkukqonvohhipc
2. **Navigate to SQL Editor**
3. **Run each CREATE TABLE statement above**
4. **Run the RLS disable statements**
5. **Test the admin dashboard**

## Storage Bucket for Resume Files

Also create a storage bucket for resume uploads:

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `resumes`
3. Set it to **Public** or configure appropriate policies

## Verification

After setup, you can test with:

```bash
# Test contacts table
curl -H "apikey: YOUR_ANON_KEY" "https://fqlvwhzkukqonvohhipc.supabase.co/rest/v1/contacts?select=*"

# Should return [] instead of an error
```

## Re-enable RLS for Production

Once everything works, re-enable RLS and create proper policies:

```sql
-- Re-enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- Add policies as needed

-- Example policy for public insert
CREATE POLICY "Allow public insert on contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read on contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
```
