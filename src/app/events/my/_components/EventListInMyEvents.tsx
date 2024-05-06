'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/_contexts/UserContext';
import EventListItemInMyEvents from './EventListItemInMyEvents';
import { ProfileWithEvents } from '@/types/profile';
import { fetchUserProfileWithEvents } from '@/api/profile';
import { hasDatePassed } from '@/helpers/date';
import { EventWithReservations } from '@/types/event';

export default function EventListInMyEvents() {
  const { user } = useUser();
  const [pastEvents, setPastEvents] = useState<EventWithReservations[]>([]);
  const [futureEvents, setFutureEvents] = useState<EventWithReservations[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        const result = (await fetchUserProfileWithEvents({ userId: user.id })) as ProfileWithEvents;

        if (result?.events_joined) {
          const events = result.events_joined as EventWithReservations[];
          setPastEvents(events.filter(event => hasDatePassed(event.date_end)));
          setFutureEvents(events.filter(event => !hasDatePassed(event.date_end)));
        }
      }
    };
    fetchEvents();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-medium text-xl mb-4">Upcoming events</h2>
        <div
          className="flex flex-col gap-7 md:gap-4 bg-gray-50 rounded-2xl py-2 md:px-8 md:py-8"
        >
          {futureEvents.length > 0 ? (
            futureEvents.map((event, i) => (
              <EventListItemInMyEvents event={event} key={i} />
            ))
          ) : (
            <div className="text-center text-gray-500">
              No upcoming events.
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-medium text-xl mb-4">Past events</h2>
        <div
          className="flex flex-col gap-7 md:gap-4 bg-gray-50 rounded-2xl py-2 md:px-8 md:py-8"
        >
          {pastEvents.length > 0 ? (
            pastEvents.map((event, i) => (
              <EventListItemInMyEvents event={event} key={i} />
            ))
          ) : (
            <div className="text-center text-gray-500">
              No past events.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
