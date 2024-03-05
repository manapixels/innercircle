'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../_utils/supabase/server';
import { Tables } from './definitions';
// import { dummyEvents } from '@/app/_lib/dummyData';

export type EventType = Tables<'events'>;
export type UserType = Tables<'profiles'> & { email?: string };

export const signUpNewUser = async (email, password) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: '/welcome',
      // data: {
      //   birthyear,
      //   birthmonth,
      //   name
      // }
    },
  });
  if (error) return error;
  return data;
};

export const signInWithEmail = async (email, password) => {
  'use server';
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/protected');
  // if (error) return error
  // return data
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return error;
  }
  return true;
};

/**
 * Fetch a single user
 * @param {number} userId
 */
export const fetchUserProfile = async (userId) => {
  const supabase = createClient();
  try {
    let { data } = await supabase.from('profiles').select(`*`).eq('id', userId).single();
    return data as UserType
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const updateUserProfile = async (user: UserType) => {
  const supabase = createClient();
  try {
    await supabase.from('profiles').upsert({
      ...user,
      updated_at: new Date().toISOString(),
    })
    const { data } = await supabase.auth.updateUser({
      data: user
    })
    return data
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const updateEmail = async (email: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.auth.updateUser({
      email
    })
    return data
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const updatePassword = async (password: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.auth.updateUser({
      password
    })
    return data
  } catch (error) {
    console.log('error', error);
    return error;
  }
};


/**
 * Fetch all roles for the current user
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserRoles = async (setState) => {
  const supabase = createClient();
  try {
    let { data } = await supabase.from('user_roles').select(`*`);
    if (setState) setState(data);
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Fetch all events and their authors
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchEvents = async () => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events')
      .select(`*`)
      .order('created_at', { ascending: true });
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Insert a new event into the DB
 * @param {string} name The event name
 * @param {string} description The event description
 * @param {number} user_id The event creator
 * @param {Date} date_start The event start date
 * @param {Date} date_end The event end date
 * @param {string} location The event location
 * @param {string} location_country The event location country
 * @param {number} price The event price
 * @param {string} price_currency The event price currency
 */
export const addEvent = async (
  name,
  description,
  user_id,
  date_start,
  date_end,
  location,
  location_country,
  price,
  price_currency,
) => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events')
      .insert([
        {
          name,
          description,
          user_id,
          date_start,
          date_end,
          location,
          location_country,
          price,
          price_currency,
        },
      ])
      .select(`*`);
    return data as EventType[];
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Delete an event from the DB
 * @param {number} event_id
 */
export const deleteEvent = async (event_id) => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events')
      .delete()
      .match({ id: event_id });
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
