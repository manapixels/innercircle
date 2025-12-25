'use server';

import fetch from 'node-fetch';
import FormData from 'form-data';

import { createClient } from '@/utils/supabase/server';
import { BUCKET_URL } from '@/constants';
import { Event } from '@/types/event';
import { formatEventDate } from '@/helpers/date';
import { ProfileWithRoles } from '@/types/profile';

// Telegram setup
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const validStatuses = ['draft', 'reserving', 'reservations-closed', 'cancelled', 'completed'];

/**
 * Fetches all events and their authors.
 * @returns The events data or error.
 */
export const fetchEvents = async () => {
  const supabase = createClient();
  try {
    const { data } = await supabase
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
    const { data } = await supabase
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
 * Fetches all events hosted by a profile.
 * @param {string} profile_id - The ID of the profile.
 * @returns The events data or error.
 */
export const fetchHostedEvents = async (profile_id: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from('events')
      .select(`
        *,
        participants:event_reservations(
          user:profiles!user_id(id, username, avatar_url, name),
          tickets_bought
        ),
        sign_ups:event_reservations(count)
      `)
      .eq('created_by', profile_id);

    const flattened = data?.map(event => ({
      ...event,
      participants: event.participants.map(participant => ({
        id: participant.user.id,
        name: participant.user.name,
        username: participant.user.username,
        avatar_url: participant.user.avatar_url,
        tickets_bought: participant.tickets_bought
      })),
      sign_ups: event.sign_ups?.[0].count
    }));

    return flattened;
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
    const { data, error } = await supabase
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
 * Updates the status of an event.
 * @param {string} event_id - The ID of the event to update.
 * @param {string} new_status - The new status to set for the event.
 * @returns The updated event data or an error if the update fails.
 */
export const updateEventStatus = async (event_id: string, new_status: string) => {

  if (!validStatuses.includes(new_status)) {
    throw new Error('Invalid status value');
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ status: new_status })
      .match({ id: event_id })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event status:', error);
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
    const { data } = await supabase
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
): Promise<string> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.rpc('sign_up_for_event', {
      p_event_id: event_id,
      p_user_id: user_id,
      p_tickets_bought: tickets_bought,
    });

    if (error) throw error;
    return data as string;
  } catch (error) {
    console.error('Error signing up for event:', error);
    return '';
  }
};

/**
 * Posts event details to a Telegram channel with an image fetched from a private source.
 * @param {string} eventId - The ID of the event to post.
 * @param {string} userId - The ID of the user posting the event.
 * @returns The response from the Telegram API or an error.
 */
export const postEventToTelegram = async (eventId: string, profile: ProfileWithRoles) => {

  if (typeof chatId === 'undefined') {
    throw new Error('chatId is undefined');
  }

  const supabase = createClient();
  // Check if the user has the 'admin' or 'host' role
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', profile.id)
    .in('role', ['admin', 'host']);

  if (rolesError) {
    throw new Error(`Failed to verify user roles: ${rolesError.message}`);
  }

  if (roles.length === 0) {
    throw new Error('Unauthorized access: Only admins and hosts can post events to Telegram.');
  }

  // Fetch event data from Supabase
  const { data: eventData, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    throw new Error(`Event lookup failed: ${error.message}`);
  }

  // Fetch the image as a buffer
  const imageResponse = await fetch(`${BUCKET_URL}/event_thumbnails/${eventData.image_thumbnail_url}`);

  if (!imageResponse.ok) throw new Error('Failed to fetch event image.');
  const imageBuffer = await imageResponse.buffer();

  // Prepare message
  let message = `
  <b>${eventData.name}</b>
at ${eventData.location_name}\n`
  if (eventData.description) {
    message += `${eventData.description}\n`
  }
  message += `${formatEventDate(eventData.date_start, eventData.date_end)}\n
Hosted by <a href="${process.env.NEXT_PUBLIC_SITE_URL}/profiles/${profile?.username}">${profile?.name}</a>

Reserve your seats <a href="${process.env.NEXT_PUBLIC_SITE_URL}/events/${eventData.slug}">here</a>
`;

  console.log(message)

  // Create form data
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', imageBuffer, eventData.image_thumbnail_url);
  formData.append('caption', message);
  formData.append('parse_mode', 'HTML');
  // Send message to Telegram
  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send message to Telegram: ${errorData.description}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(`Error sending message to Telegram: ${error}`);
  }
};