'use server';

import { User } from '@supabase/supabase-js';
import { createClient } from '../_utils/supabase/server';
import { Tables } from './definitions';

export type Event = Tables<'events'>;
export type EventWithSignUps = Tables<'events_with_host_data'>;
export type EventWithCreatorInfo = EventWithSignUps & {
  created_by: Tables<'profiles'> & {
    events_created?: number;
    guests_hosted?: number;
  };
};
export type UserWithProfile = User & Tables<'profiles'>;
export type Profile = Tables<'profiles'> & { email?: string };
export type ProfileWithRoles = Tables<'profiles_with_roles'>;
export type ProfileWithEventsHosted = Tables<'profiles_with_hosted_events'> & {
  hosted_events: EventWithSignUps[];
};

/**
 * Signs up a new user with email and password.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password for the new user.
 * @returns The data or error from the signUp operation.
 */
export const signUpNewUser = async (email, password) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: '/events',
    },
  });
  if (error) return error;
  return data;
};

/**
 * Signs in a user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password for the user.
 * @returns A boolean indicating success.
 */
export const signInWithEmail = async (email, password) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert('Could not authenticate user');
  }

  return data;
};

/**
 * Signs out the current user.
 * @returns A boolean indicating success or the error if failed.
 */
export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return error;
  }
  return true;
};

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
 * Updates the email of the current user.
 * @param {string} email - The new email to update to.
 * @returns The updated user data or error.
 */
export const updateEmail = async (email: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.auth.updateUser({
      email,
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Updates the password of the current user.
 * @param {string} password - The new password to update to.
 * @returns The updated user data or error.
 */
export const updatePassword = async (password: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.auth.updateUser({
      password,
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

/**
 * Fetches all events and their authors.
 * @returns The events data or error.
 */
export const fetchEvents = async () => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events_with_host_data')
      .select('*')
      .order('created_at', { ascending: false });

    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Fetches an event by its slug.
 * @param {string} slug - The slug of the event.
 * @returns The event data or error.
 */
export const fetchEvent = async (slug: string) => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events')
      .select(
        `
        id,
        name,
        image_thumbnail_url,
        image_banner_url,
        created_at,
        created_by (id, name, avatar_url),
        description,
        date_start,
        date_end,
        location_name,
        location_address,
        location_country,
        price,
        price_currency,
        slug
      `,
      )
      .eq('slug', slug)
      .single();
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Inserts a new event into the database.
 * @param {Object} eventDetails - The details of the event to add.
 * @returns The inserted event data or error.
 */
export const addEvent = async ({
  name,
  description,
  category,
  date_start,
  date_end,
  location_name,
  location_address,
  location_country,
  price,
  price_currency,
  slots,
  created_by,
  image_thumbnail_url,
  image_banner_url,
}: {
  name: string;
  description: string;
  category: string;
  date_start: string;
  date_end: string;
  location_name: string;
  location_address: string;
  location_country: string;
  price: number;
  price_currency: string;
  slots: number;
  created_by: string;
  image_thumbnail_url: string;
  image_banner_url: string;
}) => {
  const supabase = createClient();
  try {
    let { data, error } = await supabase.from('events').insert([
      {
        name,
        description,
        category,
        date_start,
        date_end,
        location_name,
        location_address,
        location_country,
        price,
        price_currency,
        slots,
        created_by,
        image_thumbnail_url,
        image_banner_url,
      },
    ]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Updates an existing event in the database.
 * @param {object} eventDetails - The details of the event to update.
 * @returns The updated event data or error.
 */
export const updateEvent = async ({
  id,
  name,
  description,
  category,
  date_start,
  date_end,
  location_name,
  location_address,
  location_country,
  price,
  price_currency,
  slots,
  created_by,
  image_thumbnail_url,
  image_banner_url,
}: {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  date_start?: string;
  date_end?: string;
  location_name?: string;
  location_address?: string;
  location_country?: string;
  price?: number;
  price_currency?: string;
  slots?: number;
  created_by?: string;
  image_thumbnail_url?: string;
  image_banner_url?: string;
}) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        name,
        description,
        category,
        date_start,
        date_end,
        location_name,
        location_address,
        location_country,
        price,
        price_currency,
        slots,
        created_by,
        image_thumbnail_url,
        image_banner_url,
      })
      .match({ id })
      .select('*')
      .single();

    console.log(data, error);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

/**
 * Deletes an event from the database.
 * @param {number} event_id - The ID of the event to delete.
 * @returns The deleted event data or error.
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

/**
 * Signs up a user for an event.
 * @param {string} event_id - The ID of the event.
 * @param {string} user_id - The ID of the user.
 * @param {number} tickets_bought - The number of tickets bought.
 * @returns The signup data or null if an error occurs.
 */
export const signUpForEvent = async (
  event_id: string,
  user_id: string,
  tickets_bought: number,
) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.rpc('sign_up_for_event', {
      p_event_id: event_id,
      p_user_id: user_id,
      p_tickets_bought: tickets_bought,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up for event:', error);
    return null;
  }
};

/**
 * Uploads a file to a specified Supabase bucket.
 * @param {string} userId - The ID of the user, used to rename the file.
 * @param {string} bucketId - The ID of the bucket where the file will be uploaded.
 * @param {FormData} file - The file to be uploaded.
 * @returns The uploaded file data or null if an error occurs.
 */
export const uploadFileToBucket = async (
  userId: string,
  bucketId: string,
  file: FormData,
) => {
  const supabase = createClient();
  try {
    // Check if the file object is not null and extract the file extension from the original file name
    const fileObject = file.get('file');
    if (!fileObject || !(fileObject instanceof File)) {
      throw new Error(
        'File is missing or the provided file is not an instance of File',
      );
    }
    const fileExtension = fileObject.name.split('.').pop();
    // Rename the file to userId.[original file extension]
    const fileName = `${userId}-${Math.random()}.${fileExtension}`;
    // Upload the file to the specified bucket
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(fileName, fileObject, {
        upsert: false,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading file to bucket:', error);
    return null;
  }
};

/**
 * Downloads a file from a specified Supabase bucket.
 * @param {string} bucketId - The ID of the bucket from where the file will be downloaded.
 * @param {string} fileName - The name of the file to be downloaded.
 * @returns The downloaded file data or null if an error occurs.
 */
export const downloadFileFromBucket = async (
  bucketId: string,
  fileName: string,
) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.storage
      .from(bucketId)
      .getPublicUrl(fileName);
    return data;
  } catch (error) {
    console.error('Error downloading file from bucket:', error);
    return null;
  }
};
