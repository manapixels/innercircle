import Image from 'next/image';
import Link from 'next/link';

import { Event } from '@/types/event';
import { BUCKET_URL } from '@/constants';
import {
  formatDateRange,
  hasDatePassed,
  timeBeforeEvent,
} from '@/helpers/date';
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
          {eventOver ? 'Ended' : `In ${timeBeforeEvent(event?.date_start)}`}
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

      <div className="min-w-0 py-2 flex-grow flex flex-col justify-between">
        <div>
          {/* Event name & tags */}
          <div className="flex gap-4">
            <Link
              href={`/events/${event?.slug}`}
              className="truncate text-lg font-semibold mb-1"
            >
              {event?.name}
            </Link>
            <div className="items-center gap-2 mb-2">
              {event?.category?.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {reverseSlugify(c)}
                </span>
              ))}
            </div>
          </div>
          {/* Hosted by */}
          {event?.created_by && (
            <div>
              <p>Hosted by {event?.created_by}</p>
            </div>
          )}

          {/* Location */}
          {event?.location_name && event?.location_country ? (
            <div className="flex gap-1 items-center mb-3">
              <span>at</span>
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
            </div>
          ) : (
            <span className="hidden text-sm text-gray-500 sm:block mb-3">
              {event?.location_name ? `${event?.location_name}, ` : ''}
              {event?.location_country}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          {/* Date */}
          <div className="flex gap-1 items-center">
            {event?.date_start && event?.date_end && (
              <>
                <div className="hidden text-lg text-gray-800 sm:block">
                  {formatDateRange(event?.date_start, event?.date_end)}
                </div>
                <div className="text-lg text-gray-600">
                  {new Date(event?.date_start).getFullYear()}
                </div>
              </>
            )}
          </div>
          <Link
            href={`/events/${event?.slug}`}
            className="inline-flex items-center gap-1 text-gray-500 text-sm"
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
