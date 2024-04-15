import Image from 'next/image';
import Link from 'next/link';
import { formatDateRange, hasDatePassed } from '@/app/_utils/date';
import { Event } from '@/app/_lib/actions';
import EditEventForm from './EditEventForm';

export default function EventListItemInMyEvents({ event }: { event: Event }) {
  const eventOver = hasDatePassed(event?.date_start);

  return (
    <div
      className={`relative flex gap-4 p-3 rounded-lg bg-white border`}
    >
        <div className="absolute top-0 right-0">
          <span className={`block   text-sm font-medium px-4 py-1.5 rounded align-top ${eventOver ? 'bg-gray-100 text-gray-400' : 'bg-base-600 text-white'}`}>
            {eventOver ? 'Ended' : 'Upcoming'}
          </span>
        </div>

      <div className="relative aspect-square">
        {event?.image_thumbnail_url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event_thumbnails/${event?.image_thumbnail_url}`}
            alt={`${event?.name}`}
            className="rounded-lg object-cover w-40 h-40 bg-gray-200"
            width="170"
            height="170"
          />
        ) : (
          <div className="bg-gray-200 rounded-lg w-40 h-40 flex justify-center items-center">
            <Image
              src="/logo.svg"
              alt="Inner Circle"
              width="100"
              height="100"
              className="grayscale opacity-20"
            />
          </div>
        )}
      </div>

      <div className="min-w-0 py-2 flex-grow">
        <p className="truncate text-sm font-semibold">{event.name}</p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {event.location_name}, {event.location_country}
        </p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {formatDateRange(event.date_start, event.date_end)}
        </p>
        <div className="my-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-base-700 dark:text-white">
              Ticket Sales
            </span>
            <span className="text-sm font-medium text-base-700 dark:text-white">
              {event?.slots}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3">
            <div
              className="bg-base-600 h-2.5 rounded-full"
              style={{ width: '45%' }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/events/${event.slug}`}
            className="flex items-center gap-1 bg-gray-100 font-medium rounded-full flex-grow px-7 py-2.5 hover:bg-gray-200"
          >
            View event page <svg className="inline-block" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </Link>
          <EditEventForm disabled={eventOver} />
        </div>
      </div>
    </div>
  );
}
