-- Start a transaction
BEGIN;

-- Insert users
DO $$ DECLARE
  user_id uuid;
BEGIN
  FOR i IN 1..62 LOOP
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
      i || '@innercircle.fam',
      crypt('password123', gen_salt('bf')),
      now(),
      NULL, '', NULL, '', NULL, '', '', NULL, NULL,
      '{"provider":"email","providers":["email"]}'::jsonb,
      ('{"name":"User ' || i || '","avatar_url":"","birthmonth":1, "birthyear":2000}')::jsonb,
      now(),
      now()
    );

    -- Assign 'participant' role to each user
    INSERT INTO public.user_roles (user_id, role) VALUES (user_id, 'participant');
  
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
      ('{"name":"Shirley Chen","avatar_url":"/users/shirley-chen.png","birthmonth":7, "birthyear":1993}')::jsonb,
      now(),
      now()
    );

  -- Assign 'host' roles to Shirley
  INSERT INTO public.user_roles (user_id, role) VALUES (user_id, 'host');


  -- Insert events
  INSERT INTO events (
      category, 
      created_at, 
      date_start, 
      date_end, 
      description, 
      id, 
      image_thumbnail_url,
      image_banner_url,
      location_name, 
      location_address,
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
      '2023-07-02T10:00:00+08:00', 
      '2023-08-02T20:00:00+08:00', 
      '2023-08-02T22:00:00+08:00', 
      '', 
      '514cec29-5a04-488a-8dad-5d43e861f3b8', 
      '/events/514cec29-5a04-488a-8dad-5d43e861f3b8.png', 
      '/events/514cec29-5a04-488a-8dad-5d43e861f3b8.png',
      'The Otherside', 
      '7 Erskine Rd, Singapore 069320',
      'Singapore', 
      'Speed Dating Night Debute', 
      48, 
      'completed', 
      user_id, 
      46
  ),
  (
      'speed-dating', 
      '2023-09-01T09:00:00+08:00', 
      '2023-09-21T19:00:00+08:00', 
      '2023-09-21T22:00:00+08:00', 
      '', 
      'e89dd521-24a9-4ef0-9667-8a3c46433c85', 
      '/events/e89dd521-24a9-4ef0-9667-8a3c46433c85.png', 
      '/events/e89dd521-24a9-4ef0-9667-8a3c46433c85.png',
      'The Otherside', 
      '7 Erskine Rd, Singapore 069320',
      'Singapore', 
      'When the Stars Align', 
      58, 
      'completed', 
      user_id, 
      48
  ),
  (
      'speed-dating', 
      '2023-11-01T10:00:00+08:00', 
      '2023-11-24T20:00:00+08:00', 
      '2023-11-24T22:00:00+08:00', 
      '', 
      '295f43cc-c332-40ec-ab5e-467c663241fd', 
      '/events/295f43cc-c332-40ec-ab5e-467c663241fd.jpg', 
      '/events/295f43cc-c332-40ec-ab5e-467c663241fd.jpg',
      'Projector X: No Spoilers Bar', 
      '8 Grange Rd, #05-01, Singapore 239695',
      'Singapore', 
      'It''s a Masquerade!', 
      58, 
      'completed', 
      user_id, 
      47
  ),
  (
      'speed-dating', 
      '2023-12-01T00:00:00+08:00', 
      '2023-12-23T19:00:00+08:00', 
      '2023-12-23T22:00:00+08:00', 
      '', 
      'f90d618d-291e-4923-a083-2e44651a069f', 
      '/events/f90d618d-291e-4923-a083-2e44651a069f.jpg', 
      '/events/f90d618d-291e-4923-a083-2e44651a069f.jpg',
      'Suntec City', 
      'Suntec Tower 3, 8 Temasek Blvd, Singapore 038988',
      'Singapore', 
      'Christmas Singles Night', 
      48, 
      'completed', 
      user_id, 
      56
  ),
  (
      'speed-dating', 
      '2024-01-01T10:00:00+08:00', 
      '2024-01-27T19:00:00+08:00', 
      '2024-01-27T22:00:00+08:00', 
      'kinda like single''s inferno... but not exactly', 
      'a3157df3-4b7b-451a-842b-0fe5e72ffdcf', 
      '/events/a3157df3-4b7b-451a-842b-0fe5e72ffdcf.jpg', 
      '/events/a3157df3-4b7b-451a-842b-0fe5e72ffdcf.jpg',
      'Suntec Tower 3', 
      'Suntec Tower 3, 8 Temasek Blvd, Singapore 038988',
      'Singapore', 
      'MBTI X Singles Night', 
      58, 
      'completed', 
      user_id, 
      62
  ),
  (
      'speed-dating', 
      '2024-02-20T10:00:00+08:00', 
      '2024-03-23T19:00:00+08:00', 
      '2024-03-23T22:00:00+08:00', 
      '', 
      '9a6654b8-32c3-47a8-bd82-4ad16e299663', 
      '/events/9a6654b8-32c3-47a8-bd82-4ad16e299663.jpg', 
      '/events/9a6654b8-32c3-47a8-bd82-4ad16e299663.jpg',
      'MYSEAT.sg', 
      '2 Veerasamy Rd, Singapore 207305',
      'Singapore', 
      'MBTI X Singles Night', 
      58, 
      'completed', 
      user_id, 
      100
  ),
  (
      'speed-dating', 
      '2024-03-02T09:00:00+08:00', 
      '2024-05-02T19:00:00+08:00', 
      '2024-05-02T22:00:00+08:00', 
      '', 
      '52e401c2-632c-4d96-9e4f-08d4f1c85ddd', 
      '', 
      '',
      'MYSEAT.sg', 
      '2 Veerasamy Rd, Singapore 207305',
      'Singapore', 
      'MBTI X Singles Night', 
      58, 
      'reserving', 
      user_id, 
      100
  );
END $$;

DO $$
DECLARE
  event_record RECORD;
  user_ids uuid[];
  shirley_id uuid;
  i integer;
  random_decision integer;
BEGIN
  -- Fetch Shirley's user ID to exclude her from the event sign-up process
  SELECT id INTO shirley_id FROM auth.users WHERE email = 'shirley@innercircle.fam';

  -- Fetch all event IDs and their slots
  FOR event_record IN SELECT id, slots FROM public.events LOOP
    -- Fetch user IDs from the auth.users table, limited by the number of slots for the event
    SELECT array_agg(id) INTO user_ids FROM auth.users WHERE id <> shirley_id LIMIT event_record.slots;

    -- Loop through the user IDs and randomly decide whether to sign up each user for the current event
    FOR i IN 1..array_length(user_ids, 1) LOOP
      -- Generate a random number (0 or 1)
      random_decision := floor(random() * 2)::int;
      
      -- If random_decision is 1, then sign up the user for the event
      IF random_decision = 1 THEN
        PERFORM public.sign_up_for_event(event_record.id, user_ids[i], 1); -- Assuming each user buys 1 ticket
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Commit the transaction
COMMIT;
