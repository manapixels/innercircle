import Image from 'next/image';
import Link from 'next/link';
import { formatDateRange, hasDatePassed } from '@/app/_utils/date';
import { Event } from '@/app/_lib/actions';
import EditEventForm from './EditEventForm';

export default function EventListItemInMyEvents({ event }: { event: Event }) {
  return (
    <div className="flex gap-4 p-3 rounded-lg">
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

        {!hasDatePassed(event.date_end) && (
          <div className="absolute top-3 right-3">
            <span className="bg-base-600 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              Upcoming
            </span>
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
            className="bg-gray-100 font-medium rounded-full flex-grow px-7 py-2.5 hover:bg-gray-200"
          >
            View
          </Link>
          <EditEventForm />
        </div>
      </div>
    </div>
  );
}
