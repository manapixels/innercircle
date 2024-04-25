'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/_contexts/UserContext';
import { Event, ProfileWithRoles, fetchUserProfile } from '@/_lib/actions';
import EventListItemInMyEvents from './EventListItemInMyEvents';

export default function EventListInMyEvents() {
  const { user } = useUser();
  const [signedUpEvents, setSignedUpEvents] = useState<Event[] | undefined>();

  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        const result = (await fetchUserProfile(user.id)) as ProfileWithRoles;
        if (result?.signed_up_events) {
          setSignedUpEvents(result.signed_up_events as Event[]);
        }
      }
    };
    fetchEvents();
  }, [user]);

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 rounded-2xl p-8`}
    >
      {signedUpEvents?.map((event, i) => {
        return <EventListItemInMyEvents event={event} key={i} />;
      })}
    </div>
  );
}
