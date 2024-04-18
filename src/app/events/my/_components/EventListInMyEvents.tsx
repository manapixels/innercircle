'use client';

import { useUser } from '@/_contexts/UserContext';
import {
  EventWithSignUps,
  fetchUserProfileWithHostedEventsWithId,
} from '@/_lib/actions';
import EventListItemInMyEvents from './EventListItemInMyEvents';
import { useEffect, useState } from 'react';

export default function EventListInMyEvents() {
  const { user } = useUser();
  const [hostedEvents, setHostedEvents] = useState<
    EventWithSignUps[] | undefined
  >();
  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        const result = await fetchUserProfileWithHostedEventsWithId(user.id);
        if (result?.hosted_events) {
          setHostedEvents(result.hosted_events as EventWithSignUps[]);
        }
      }
    };
    fetchEvents();
  }, [user]);

  const updateEventInList = (updatedEvent: EventWithSignUps) => {
    setHostedEvents((currentEvents) => {
      return currentEvents?.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      );
    });
  };

  return (
    <div className={`grid grid-cols-1 gap-6 bg-gray-50 rounded-2xl p-8`}>
      {hostedEvents?.map((event, i) => {
        return (
          <EventListItemInMyEvents
            event={event}
            key={i}
            updateEventInList={updateEventInList}
          />
        );
      })}
    </div>
  );
}
