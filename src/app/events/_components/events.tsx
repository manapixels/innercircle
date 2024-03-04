'use client';

import Image from 'next/image';
import { StoreContext } from '@/app/_lib/actions';
import { useContext } from 'react';
import { formatDateRange } from '@/app/_utils/date';
import Link from 'next/link';

export default function Events() {
  const { events } = useContext(StoreContext) || {};

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events?.map((event, i) => {
          return (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className={`p-3 rounded-lg ${i !== 0 ?? 'border-t'} hover:bg-gray-100`}
            >
              <div className="w-full relative aspect-square">
                <Image
                  src={event.image_url || ''}
                  alt={`${event.name}'s profile picture`}
                  className="rounded-lg object-cover w-full h-full"
                  width="300"
                  height="300"
                />
                <div className="rounded-full absolute bottom-5 left-5 bg-white w-16 h-16"></div>
                <div className="rounded-full absolute bottom-14 left-14 bg-base-400 w-6 h-6"></div>
                <Image
                  src={'/users/shirley-chen.jpg' || ''}
                  alt="Host"
                  className="rounded-full absolute bottom-5 left-5 p-1"
                  width="60"
                  height="60"
                />
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
        })}
      </div>
    </div>
  );
}
