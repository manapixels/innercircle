"use client"

import { createContext, useState, useEffect, useContext } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database, Tables } from './definitions'

export type EventType = Tables<'events'>
export type UserType = Tables<'users'>

type StoreContextType = {
  events: EventType[]
  users: Map<string, UserType>
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => useContext(StoreContext);

export const supabase = createPagesBrowserClient<Database>()

export const StoreContextProvider = (
  {
  children
}: {
  children: React.ReactNode;
}
) => {
  const [events, setEvents] = useState<EventType[]>([])
  const [users, setUsers] = useState<Map<string, UserType>>(new Map())
  const [newOrUpdatedEvent, handleNewOrUpdatedEvent] = useState<EventType | null>(null)
  const [deletedEvent, handleDeletedEvent] = useState<EventType | null>(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<UserType | null>(null)

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Events
    fetchEvents(setEvents)
    // Listen for new and deleted events
    const eventListener = supabase
      .channel('public:events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          if (payload.new) {
            const newEvent = payload.new as EventType;
            handleNewOrUpdatedEvent(newEvent);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'events' },
        (payload) => {
          if (payload.old) {
            const oldEvent = payload.old as EventType;
            handleDeletedEvent(oldEvent);
          }
        }
      )
      .subscribe()
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          if (payload.new) {
            const newUser = payload.new as UserType;
            handleNewOrUpdatedUser(newUser);
          }
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(eventListener)
      supabase.removeChannel(userListener)
    }
  }, [])

  // New event received from Postgres
  useEffect(() => {
    if (newOrUpdatedEvent) {
      setEvents(prevEvents => {
        const eventIndex = prevEvents.findIndex(event => event.id === newOrUpdatedEvent.id);
        if (eventIndex > -1) {
          const updatedEvents = [...prevEvents];
          updatedEvents[eventIndex] = newOrUpdatedEvent;
          return updatedEvents;
        } else {
          return [...prevEvents, newOrUpdatedEvent];
        }
      });
    }
  }, [newOrUpdatedEvent])

  // Deleted event received from postgres
  useEffect(() => {
    if (deletedEvent) {
      setEvents(prevEvents => prevEvents.filter((event) => event.id !== deletedEvent.id));
    }
  }, [deletedEvent])

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) {
      setUsers(prevUsers => {
        const updatedUsers = new Map(prevUsers);
        updatedUsers.set(newOrUpdatedUser.id, newOrUpdatedUser);
        return updatedUsers;
      });
    }
  }, [newOrUpdatedUser])

  return (
    <StoreContext.Provider
      value={{
        events,
        users
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}


/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState) => {
  try {
    let { data } = await supabase
      .from('users')
      .select(`*`)
      .eq('id', userId)

    if (data?.[0]) {
      let user = data[0] as UserType;
      if (setState) setState(user)
      return user
    }
    return null
  } catch (error) {
    console.log('error', error)
    return error
  }
}

/**
 * Fetch all roles for the current user
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserRoles = async (setState) => {
  try {
    let { data } = await supabase
      .from('user_roles')
      .select(`*`)
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
    return error
  }
}

/**
 * Fetch all events and their authors
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchEvents = async (setState) => {
  try {
    let { data } = await supabase
      .from('events')
      .select(`*`)
      .order('created_at', { ascending: true })
    if (setState) setState(data as EventType[])
    return data
  } catch (error) {
    console.log('error', error)
    return error
  }
}

/**
 * Insert a new event into the DB
 * @param {string} name The event name
 * @param {string} description The event description
 * @param {number} user_id The event creator
 * @param {Date} date_start The event start date
 * @param {Date} date_end The event end date
 * @param {string} location The event location
 */
export const addEvent = async (name, description, user_id, date_start, date_end, location) => {
  try {
    let { data } = await supabase
      .from('events')
      .insert([{
        name,
        description,
        user_id,
        date_start,
        date_end,
        location
      }])
      .select(`*`)
    return data as EventType[]
  } catch (error) {
    console.log('error', error)
    return error
  }
}

/**
 * Delete an event from the DB
 * @param {number} event_id
 */
export const deleteEvent = async (event_id) => {
  try {
    let { data } = await supabase
      .from('events')
      .delete()
      .match({ id: event_id })
    return data
  } catch (error) {
    console.log('error', error)
    return error
  }
}