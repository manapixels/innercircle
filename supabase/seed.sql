-- Start a transaction
BEGIN;

-- Insert users
DO $$ DECLARE
  user_id uuid;
BEGIN
  FOR i IN 1..55 LOOP
    user_id := uuid_generate_v4();
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at,
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
      NULL, '', NULL, '', NULL, '', '', NULL, NULL,
      '{"provider":"email","providers":["email"]}'::jsonb,
      ('{"name":"User ' || i || '","avatar_url":"","birthmonth":1, "birthyear":2000}')::jsonb,
      now(),
      now()
    );
  END LOOP;

  user_id := uuid_generate_v4();
  INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'shirley@innercircle.fam',
      crypt('password123', gen_salt('bf')),
      now(),
      NULL, '', NULL, '', NULL, '', '', NULL, NULL,
      '{"provider":"email","providers":["email"]}'::jsonb,
      ('{"name":"Shirley Chen","avatar_url":"/users/shirley-chen.jpg","birthmonth":7, "birthyear":1993}')::jsonb,
      now(),
      now()
    );

  -- Insert events
  INSERT INTO events (
      category, 
      created_at, 
      date_end, 
      date_start, 
      description, 
      id, 
      image_url, 
      location, 
      location_country, 
      name, 
      price, 
      status, 
      created_by, 
      slots
  ) 
  VALUES 
  (
      'speed-dating', 
      '2023-11-01T10:00:00Z', 
      '2023-11-24T22:00:00Z', 
      '2023-11-24T19:00:00Z', 
      '', 
      '295f43cc-c332-40ec-ab5e-467c663241fd', 
      '/1.jpg', 
      'No Spoilers Bar, Orchard Cineleisure', 
      'Singapore', 
      'Mystery Date, Speed Dating Night', 
      58, 
      'completed', 
      user_id, 
      50
  ),
  (
      'speed-dating', 
      '2023-12-01T00:00:00Z', 
      '2023-12-23T19:00:00Z', 
      '2023-12-23T00:00:00Z', 
      '', 
      'f90d618d-291e-4923-a083-2e44651a069f', 
      '/2.jpg', 
      'The Soul Atelier, Suntec', 
      'Singapore', 
      'Speed Dating Night X''mas Edition', 
      48, 
      'completed', 
      user_id, 
      50
  ),
  (
      'speed-dating', 
      '2024-01-01T10:00:00Z', 
      '2024-01-27T22:00:00Z', 
      '2024-01-27T19:00:00Z', 
      'kinda like single''s inferno... but not exactly', 
      'a3157df3-4b7b-451a-842b-0fe5e72ffdcf', 
      '/3.jpg', 
      'Suntec Tower 3', 
      'Singapore', 
      'Singles Night', 
      0, 
      'completed', 
      user_id, 
      45
  ),
  (
      'speed-dating', 
      '2024-02-01T10:00:00Z', 
      '2024-02-17T14:00:00Z', 
      '2024-02-17T17:00:00Z', 
      '', 
      'a77cd08e-c65c-460d-85bd-b5ce67f1cd9c', 
      '/4.jpg', 
      'Suntec Tower 3', 
      'Singapore', 
      'Looking for love', 
      0, 
      'cancelled', 
      user_id, 
      45
  ),
  (
      'speed-dating', 
      '2024-02-20T10:00:00Z', 
      '2024-03-16T19:00:00Z', 
      '2024-03-16T22:00:00Z', 
      '', 
      '9a6654b8-32c3-47a8-bd82-4ad16e299663', 
      '/5.jpg', 
      'Suntec Tower 3', 
      'Singapore', 
      'MBTI Rooftop Party', 
      0, 
      'reserving', 
      user_id, 
      45
  );
END $$;

-- Commit the transaction
COMMIT;
