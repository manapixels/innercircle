import Image from 'next/image';
import Link from 'next/link';

import { Event } from '@/types/event';
import { BUCKET_URL } from '@/constants';
import { formatDateRange, hasDatePassed, timeUntil } from '@/helpers/date';
import { reverseSlugify } from '@/helpers/text';

export default function EventListItemInMyEvents({ event }: { event: Event }) {
  const eventOver = hasDatePassed(event?.date_start);

  return (
    <div
      className={`relative flex gap-4 p-6 rounded-lg bg-white border ${eventOver ? 'col-span-1' : 'col-span-2 lg:col-span-4'}`}
    >
      <div className="absolute top-0 right-0">
        <span
          className={`block   text-sm font-medium px-4 py-1.5 rounded align-top ${eventOver ? 'bg-gray-100 text-gray-400' : 'bg-base-600 text-white'}`}
        >
          {eventOver ? 'Ended' : 'Upcoming'}
        </span>
      </div>

      <div className="relative aspect-square">
        {event?.image_thumbnail_url ? (
          <Image
            src={`${BUCKET_URL}/event_thumbnails/${event?.image_thumbnail_url}`}
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
        {/* Event name */}
        <p className="truncate text-lg font-semibold mb-1">{event?.name}</p>
        {/* Tags */}
        <div className="flex items-center gap-2 mb-2">
          {event?.category?.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {reverseSlugify(c)}
            </span>
          ))}
        </div>
        {/* Location */}
        {event?.location_name && event?.location_country ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name)},${encodeURIComponent(event.location_country)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-gray-500 sm:block hover:text-base-600 group"
          >
            {event?.location_name}, {event?.location_country}
            <svg
              className="hidden group-hover:inline-block"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#927800"
            >
              <path
                d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                stroke="#927800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </a>
        ) : (
          <span className="hidden text-sm text-gray-500 sm:block">
            {event?.location_name ? `${event?.location_name}, ` : ''}
            {event?.location_country}
          </span>
        )}
        {event?.date_start && event?.date_end && (
          <p className="hidden text-sm text-gray-500 sm:block">
            {formatDateRange(event?.date_start, event?.date_end)}
            {!eventOver && (
              <span className="text-gray-400 ml-2">
                {timeUntil(event?.date_start)} left
              </span>
            )}
          </p>
        )}

        <div className="flex items-center gap-4">
          <Link
            href={`/events/${event?.slug}`}
            className="flex items-center gap-1 text-gray-500 text-sm"
          >
            View event page{' '}
            <svg
              className="inline-block"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
            >
              <path
                d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
