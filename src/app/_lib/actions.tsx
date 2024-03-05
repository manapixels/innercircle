'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../_utils/supabase/server';
// import { createContext, useState, useEffect, useContext } from 'react';
import { Tables } from './definitions';
// import { dummyEvents } from '@/app/_lib/dummyData';

export type EventType = Tables<'events'>;
export type UserType = Tables<'profiles'> & { email?: string };

// type StoreContextType = {
//   events: EventType[]
//   user: UserType | null
// }

// export const StoreContext = createContext<StoreContextType | null>(null);

// export const useStore = () => useContext(StoreContext);

// export const StoreContextProvider = (
//   {
//   children
// }: {
//   children: React.ReactNode;
// }
// ) => {
//   const [events, setEvents] = useState<EventType[]>(dummyEvents)
//   const [newOrUpdatedEvent, handleNewOrUpdatedEvent] = useState<EventType | null>(null)
//   const [deletedEvent, handleDeletedEvent] = useState<EventType | null>(null)
//   const [user, setUser] = useState<UserType | null>(null)

//   // Load initial data and set up listeners
//   useEffect(() => {

//     // Check active sessions and set user
//     supabase.auth.getSession().then(({ data, error }) => {
//       if (data?.session?.user) {
//         const _user = {
//           id: data.session.user.id,
//           email: data.session.user.email || "",
//           avatar_url: data.session.user.user_metadata.avatar_url,
//           name: data.session.user.user_metadata.full_name,
//         } as UserType
//         setUser(_user);
//       }
//     });
//     // Listen for changes on auth state (login, logout)
//     supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) {
//         const _user = {
//           id: session.user.id,
//           email: session.user.email || "",
//           avatar_url: session.user.user_metadata.avatar_url,
//           name: session.user.user_metadata.full_name,
//         } as UserType
//         setUser(_user);
//       } else {
//         setUser(null);
//       }
//     });

//     // Get Events
//     // fetchEvents(setEvents)
//     // Listen for new and deleted events
//     const eventListener = supabase
//       .channel('public:events')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'events' },
//         (payload) => {
//           if (payload.new) {
//             const newEvent = payload.new as EventType;
//             handleNewOrUpdatedEvent(newEvent);
//           }
//         }
//       )
//       .on(
//         'postgres_changes',
//         { event: 'DELETE', schema: 'public', table: 'events' },
//         (payload) => {
//           if (payload.old) {
//             const oldEvent = payload.old as EventType;
//             handleDeletedEvent(oldEvent);
//           }
//         }
//       )
//       .subscribe()

//     // Cleanup on unmount
//     return () => {
//       supabase.removeChannel(eventListener)
//     }
//   }, [])

//   // New event received from Postgres
//   useEffect(() => {
//     if (newOrUpdatedEvent) {
//       setEvents(prevEvents => {
//         const eventIndex = prevEvents.findIndex(event => event.id === newOrUpdatedEvent.id);
//         if (eventIndex > -1) {
//           const updatedEvents = [...prevEvents];
//           updatedEvents[eventIndex] = newOrUpdatedEvent;
//           return updatedEvents;
//         } else {
//           return [...prevEvents, newOrUpdatedEvent];
//         }
//       });
//     }
//   }, [newOrUpdatedEvent])

//   // Deleted event received from postgres
//   useEffect(() => {
//     if (deletedEvent) {
//       setEvents(prevEvents => prevEvents.filter((event) => event.id !== deletedEvent.id));
//     }
//   }, [deletedEvent])

//   // New or updated user received from Postgres
//   useEffect(() => {
//     if (user) {
//       setUser(user);
//     }
//   }, [user])

//   return (
//     <StoreContext.Provider
//       value={{
//         events,
//         user
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   )
// }

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
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState) => {
  const supabase = createClient();
  try {
    let { data } = await supabase.from('users').select(`*`).eq('id', userId);

    if (data?.[0]) {
      let user = data[0] as UserType;
      if (setState) setState(user);
      return user;
    }
    return null;
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
export const fetchEvents = async (setState) => {
  const supabase = createClient();
  try {
    let { data } = await supabase
      .from('events')
      .select(`*`)
      .order('created_at', { ascending: true });
    if (setState) setState(data as EventType[]);
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
