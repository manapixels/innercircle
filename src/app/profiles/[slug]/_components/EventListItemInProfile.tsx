'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BUCKET_URL } from '@/constants';
import { formatDateRange, hasDatePassed, timeBeforeEvent } from '@/helpers/date';
import { Event } from '@/types/event';


export default function EventListItemInProfile({
  event,
}: {
  event: Event;
}) {

  return (
    <Link
      href={`/events/${event.slug}`}
      key={event.slug}
      className="p-3 rounded-lg hover:bg-gray-100"
    >
      <div className="w-full relative aspect-square">
        {event?.image_thumbnail_url ? (
          <Image
            src={`${BUCKET_URL}/event_thumbnails/${event?.image_thumbnail_url}`}
            alt={`${event?.name}`}
            className="rounded-lg object-cover w-full h-full"
            width="300"
            height="300"
          />
        ) : (
          <div className="bg-gray-200 rounded-lg w-full h-full flex justify-center items-center">
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
              In {timeBeforeEvent(event?.date_start)}
            </span>
          </div>
        )}

        <div className="absolute bottom-5 left-5 w-16 h-16">
          <div className="rounded-full absolute bottom-0 left-0 bg-white w-16 h-16"></div>
          <div className="rounded-full absolute bottom-9 left-9 bg-base-400 w-6 h-6"></div>
        </div>
      </div>

      <div className="min-w-0 py-2">
        <p className="truncate text-sm font-semibold">{event.name}</p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {event.location_name}, {event.location_country}
        </p>
        {event.date_start && event.date_end && (
          <p className="hidden text-sm text-gray-500 sm:block">
            {formatDateRange(event.date_start, event.date_end, true)}
          </p>
        )}
      </div>
    </Link>
  );
}
