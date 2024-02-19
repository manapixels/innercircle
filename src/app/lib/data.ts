import { useState, useEffect } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database, Tables } from './definitions'

type EventType = Tables<'events'>
type UserType = Tables<'users'>

export const supabase = createPagesBrowserClient<Database>()

export const useStore = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [users] = useState(new Map())
  const [newOrUpdatedEvent, handleNewOrUpdatedEvent] = useState({})
  const [deletedEvent, handleDeletedEvent] = useState({})
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState({})

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
        (payload) => payload.new && handleNewOrUpdatedEvent(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'events' },
        (payload) => handleDeletedEvent(payload.old)
      )
      .subscribe()
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => payload.new && handleNewOrUpdatedUser(payload.new)
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
      const handleAsync = async () => {
        setEvents(events.concat(newOrUpdatedEvent as EventType))
      }
      handleAsync()
    }
  }, [newOrUpdatedEvent])

  // Deleted event received from postgres
  useEffect(() => {
    if (deletedEvent) {
      const eventToDelete = deletedEvent as UserType;
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedEvent])

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) {
      const userToUpdate = newOrUpdatedUser as UserType
      users.set(userToUpdate.id, userToUpdate)
    }
  }, [newOrUpdatedUser])

  return {
    // We can export computed values here to map the authors to each message
    events: events.map((x) => ({ ...x, author: users.get(x.user_id) })),
    users,
  }
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
      let user = data[0]
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
    if (setState) setState(data)
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
    return data
  } catch (error) {
    console.log('error', error)
    return error
  }
}

/**
 * Delete a event from the DB
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