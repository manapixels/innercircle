'use server';

import { createClient } from '@/utils/supabase/server';
import { Event } from '@/types/event';

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
      .from('events_with_host_data')
      .select('*')
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
  name: Event['name'];
  description: Event['description'];
  category: Event['category'];
  date_start: Event['date_start'];
  date_end: Event['date_end'];
  location_name: Event['location_name'];
  location_address: Event['location_address'];
  location_country: Event['location_country'];
  price: Event['price'];
  price_currency: Event['price_currency'];
  slots: Event['slots'];
  created_by: Event['created_by'];
  image_thumbnail_url: Event['image_thumbnail_url'];
  image_banner_url: Event['image_banner_url'];
}) => {
  const supabase = createClient();
  try {
    let { data, error } = await supabase
      .from('events')
      .insert([
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
      ])
      .select();

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
  name?: Event['name'];
  description?: Event['description'];
  category?: Event['category'];
  date_start?: Event['date_start'];
  date_end?: Event['date_end'];
  location_name?: Event['location_name'];
  location_address?: Event['location_address'];
  location_country?: Event['location_country'];
  price?: Event['price'];
  price_currency?: Event['price_currency'];
  slots?: Event['slots'];
  created_by?: Event['created_by'];
  image_thumbnail_url?: Event['image_thumbnail_url'];
  image_banner_url?: Event['image_banner_url'];
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
  stripe_session_id: string,
  user_id: string,
  tickets_bought: number,
) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.rpc('sign_up_for_event', {
      p_event_id: event_id,
      p_stripe_session_id: stripe_session_id,
      p_user_id: user_id,
      p_tickets_bought: tickets_bought,
    });

    if (error) throw error;
    return data as string;
  } catch (error) {
    console.error('Error signing up for event:', error);
    return null;
  }
};