
-- Insert admin user into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@gmail.com',
  crypt('WaluigiLuigi9842!!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"user_type": "admin", "first_name": "Admin", "last_name": "User"}'::jsonb,
  false,
  'authenticated'
);

-- The handle_new_user trigger will automatically create the profile entry
-- with user_type = 'admin' based on the raw_user_meta_data
