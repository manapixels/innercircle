'use client';

import Image from 'next/image';
import { StoreContext } from '@/app/_lib/data';
import { useContext } from 'react';

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {events?.map((event, i) => {
          return (
            <div
              key={event.id}
              className={`flex flex-row items-center justify-between py-4 ${i !== 0 ?? 'border-t'}`}
            >
              <div className="flex items-center">
                <Image
                  src={event.image_url || ''}
                  alt={`${event.name}'s profile picture`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {event.name}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {event.location}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {event.date_start} {event.date_end}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
