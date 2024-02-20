-- Start a transaction
BEGIN;

-- Insert users
DO $$
DECLARE
  user_id uuid;
BEGIN
  FOR i IN 1..10 LOOP
    user_id := uuid_generate_v4();
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      i || '@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      ('{"name":"User ' || i || '","avatar_url":"","birthmonth":1, "birthyear":2000}')::jsonb,
      now(),
      now()
    );
  END LOOP;
END $$;

-- Commit the transaction
COMMIT;