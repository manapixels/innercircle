import { EventType, fetchEvent } from '@/app/_lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'innercircle | Event',
};

export default async function EventDetailsPage({ params: { id } }: { params: { id: string } }) {

  const event = (await fetchEvent(id as string)) as EventType;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 max-w-7xl mx-auto">
      {event.id}
    </div>
  );
}
