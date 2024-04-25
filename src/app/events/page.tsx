import { Metadata } from 'next';
import { fetchEvents } from '@/api/event';
import EventListItem from './_components/EventListItem';
import { EventWithCreatorInfo } from '@/types/event';

export const metadata: Metadata = {
  title: 'innercircle | All events',
};

export default async function EventsPage() {
  const events = (await fetchEvents()) as EventWithCreatorInfo[];

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events?.map((event, i) => {
          return <EventListItem event={event} key={i} />;
        })}
      </div>
    </div>
  );
}
