'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/_contexts/UserContext';
import EventListItemInMyEvents from './EventListItemInMyEvents';
import { ProfileWithRoles } from '@/types/profile';
import { fetchUserProfile } from '@/api/profile';
import { hasDatePassed } from '@/helpers/date';
import { Event } from '@/types/event';

export default function EventListInMyEvents() {
  const { user } = useUser();
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [futureEvents, setFutureEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        const result = (await fetchUserProfile(user.id)) as ProfileWithRoles;

        console.log(result);
        if (result?.signed_up_events) {
          const events = result.signed_up_events as Event[];
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 rounded-2xl p-8"
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 rounded-2xl p-8"
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
