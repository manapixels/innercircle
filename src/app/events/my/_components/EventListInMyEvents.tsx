'use client';

import { useUser } from '@/app/_contexts/UserContext';
import { EventWithSignUps, fetchUserProfileWithHostedEvents } from '@/app/_lib/actions';
import EventListItemInMyEvents from './EventListItemInMyEvents';
import { useEffect, useState } from 'react';

export default function EventListInMyEvents() {
  const { profile } = useUser();
  const [hostedEvents, setHostedEvents] = useState<EventWithSignUps[] | undefined>();

  useEffect(() => {
    const fetchEvents = async () => {
      if (profile?.username) {
        await fetchUserProfileWithHostedEvents(profile.username).then((_profile) => {
          if (_profile?.hosted_events) {
            console.log(_profile.hosted_events)
            setHostedEvents(_profile.hosted_events as EventWithSignUps[]);
          }
        });
      }
    };
    fetchEvents();
  }, [profile]);

  return (
    <div className={`grid grid-cols-1 gap-6 bg-gray-50 rounded-2xl p-8`}>
      {hostedEvents?.map((event, i) => {
        return <EventListItemInMyEvents event={event} key={i} />;
      })}
    </div>
  );
}
