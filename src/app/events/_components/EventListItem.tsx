'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDateRange, hasDatePassed } from '@/app/_utils/date';
import { EventWithCreatorInfo } from '@/app/_lib/actions';
import Tippy from '@tippyjs/react';

export default function EventListItem({
  event,
}: {
  event: EventWithCreatorInfo;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      key={event.slug}
      className={`p-3 rounded-lg hover:bg-gray-100 ${hasDatePassed(event.date_end) && 'grayscale opacity-80'} hover:grayscale-0 hover:opacity-100`}
    >
      <div className="w-full relative aspect-square">
        <Image
          src={event?.image_url || ''}
          alt={`${event?.name}`}
          className="rounded-lg object-cover w-full h-full"
          width="300"
          height="300"
        />
        <div className="rounded-full absolute bottom-5 left-5 bg-white w-16 h-16"></div>
        <div className="rounded-full absolute bottom-14 left-14 bg-base-400 w-6 h-6"></div>

        <Tippy content={
            <div><span className="uppercase tracking-wide text-xs text-gray-300">Your host:</span> {event?.created_by?.name}</div>
        }>
          <Image
            src={
              event?.created_by?.avatar_url
                ? event.created_by.avatar_url
                : '/users/shirley-chen.jpg'
            }
            alt={event?.created_by?.name || ''}
            className="rounded-full absolute bottom-5 left-5 p-1"
            width="60"
            height="60"
          />
        </Tippy>
      </div>
      <div className="min-w-0 py-2">
        <p className="truncate text-sm font-semibold">{event.name}</p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {event.location}
        </p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {formatDateRange(event.date_start, event.date_end)}
        </p>
        <p className="truncate text-sm mt-1">
          <span className="font-semibold uppercase mr-1">
            ${event.price} {event.price_currency}
          </span>
          <span className="text-sm text-gray-400">
            {event.slots} slots left
          </span>
        </p>
      </div>
    </Link>
  );
}
