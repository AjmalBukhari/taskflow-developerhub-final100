-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new)

-- 1. Create uploadFiles table
CREATE TABLE uploadFiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  size BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uploadfiles_user_id ON uploadFiles(user_id);
CREATE INDEX idx_uploadfiles_task_id ON uploadFiles(task_id);

-- 2. Create storage bucket for file uploads
-- Go to: Storage → New Bucket
-- Name: taskflow-files
-- Public bucket: ON
-- Then add this RLS policy to allow service_role access:

-- Allow public read access to all files in the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'taskflow-files');

-- Allow service_role (backend) to upload/delete
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'taskflow-files')
WITH CHECK (bucket_id = 'taskflow-files');
