'use client';

import Image from 'next/image';
import { StoreContext } from '@/app/_lib/data';
import { useContext } from 'react';
import { formatDateRange } from '@/app/_lib/helpers';
import Link from 'next/link';

export default function Events() {
  const { events } = useContext(StoreContext) || {};

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex items-center justify-center pb-4 md:pb-8 flex-wrap">
        <button
          type="button"
          className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
        >
          All
        </button>
        <button
          type="button"
          className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
        >
          Dating
        </button>
        <button
          type="button"
          className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
        >
          Retreats
        </button>
      </div>
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
                  className="rounded-lg"
                  layout="fill"
                  objectFit="cover"
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
