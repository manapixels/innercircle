import { EventWithCreatorInfo, fetchEvent } from '@/app/_lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'innercircle | Event',
};

export default async function EventDetailsPage({ params: { slug } }: { params: { slug: string } }) {

  const event = (await fetchEvent(slug as string)) as EventWithCreatorInfo;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 max-w-7xl mx-auto">
      {event?.slug}

      <div>Hosted by {event?.created_by.name}</div>
    </div>
  );
}
