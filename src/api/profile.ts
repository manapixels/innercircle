'use server';

import { createClient } from '@/utils/supabase/server';
import { Profile, ProfileWithRoles } from '@/types/profile';

/**
 * Fetches a single user profile by user ID.
 * @param {number} userId - The ID of the user.
 * @returns The user profile data or error.
 */
export const fetchUserProfile = async (userId) => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('profiles_with_roles')
      .select(`*`)
      .eq('id', userId)
      .single();

    return data as ProfileWithRoles;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Fetches a profile with hosted events by username.
 * @param {string} username - The username of the profile.
 * @returns The profile data with hosted events or null if an error occurs.
 */
export const fetchUserProfileWithHostedEvents = async (username: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('profiles_with_hosted_events')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw new Error('Error fetching profile with hosted events');

    if (data && data.hosted_events) {
      data.hosted_events.sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime(),
      );
    }

    return data;
  } catch (error) {
    console.error('error', error);
    return null; // Or handle the error as needed
  }
};

/**
 * Fetches a profile with hosted events by user ID.
 * @param {string} id - The ID of the user.
 * @returns The profile data with hosted events or null if an error occurs.
 */
export const fetchUserProfileWithHostedEventsWithId = async (id: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('profiles_with_hosted_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Error fetching profile with hosted events');

    if (data && data.hosted_events) {
      data.hosted_events.sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime(),
      );
    }

    return data;
  } catch (error) {
    console.error('error', error);
    return null; // Or handle the error as needed
  }
};

/**
 * Updates a user profile.
 * @param {Profile} user - The user profile data to update.
 * @returns The updated user data or error.
 */
export const updateUserProfile = async (user: Profile) => {
  const supabase = createClient();
  try {
    await supabase.from('profiles').upsert({
      ...user,
      updated_at: new Date().toISOString(),
    });
    const { data } = await supabase.auth.updateUser({
      data: user,
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Fetches all roles for the current user.
 * @param {function} setState - Optionally pass in a hook or callback to set the state.
 * @returns The roles data or error.
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