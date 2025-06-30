
-- Delete any existing admin user first (in case there's a conflict)
DELETE FROM auth.users WHERE email = 'admin@gmail.com';

-- Insert admin user with correct columns only
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
  role,
  aud
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
  'authenticated',
  'authenticated'
);
