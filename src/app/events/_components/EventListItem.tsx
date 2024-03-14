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
        {event?.image_url ? (
          <Image
            src={event?.image_url}
            alt={`${event?.name}`}
            className="rounded-lg object-cover w-full h-full"
            width="300"
            height="300"
          />
        ) : (
          <div className="bg-gray-200 rounded-lg w-full h-full flex justify-center items-center">
            <Image
              src="./logo.svg"
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

        <div className="absolute bottom-5 left-5 w-16 h-16">
          <div className="rounded-full absolute bottom-0 left-0 bg-white w-16 h-16"></div>
          <div className="rounded-full absolute bottom-9 left-9 bg-base-400 w-6 h-6"></div>

          <Tippy
            className="bg-slate-800"
            content={
              <div className="py-4 px-6 text-center">
                <Image
                  src={
                    event?.created_by?.avatar_url
                      ? event.created_by.avatar_url
                      : '/users/shirley-chen.png'
                  }
                  alt=""
                  width={60}
                  height={60}
                  className="rounded-full mx-auto mb-1"
                />
                <div className="font-medium">{event?.created_by?.name}</div>
                <div className="text-xs text-gray-400 mb-3">Your host</div>

                <div className="text-xs text-gray-300">Hosted</div>
                <dl className="grid max-w-screen-xl grid-cols-2 gap-8 py-2 px-4 mx-auto">
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-xl font-extrabold">
                      {event?.created_by?.events_created}
                    </dt>
                    <dd className="text-gray-500 dark:text-gray-400 text-sm">
                      Events
                    </dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-xl font-extrabold">
                      {event?.created_by?.guests_hosted}
                    </dt>
                    <dd className="text-gray-500 dark:text-gray-400 text-sm">
                      Guests
                    </dd>
                  </div>
                </dl>
              </div>
            }
          >
            <Image
              src={
                event?.created_by?.avatar_url
                  ? event.created_by.avatar_url
                  : '/users/shirley-chen.png'
              }
              alt={event?.created_by?.name || ''}
              className="rounded-full absolute bottom-0.5 left-0.5 p-1"
              width="60"
              height="60"
            />
          </Tippy>
        </div>
      </div>
      <div className="min-w-0 py-2">
        <p className="truncate text-sm font-semibold">{event.name}</p>
        <p className="hidden text-sm text-gray-500 sm:block">
          {event.location_name}, {event.location_country}
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
