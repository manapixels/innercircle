'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDateRange, hasDatePassed } from '@/_utils/date';
import { EventWithCreatorInfo } from '@/_lib/actions';
import { BUCKET_URL } from '@/_lib/constants';
import Tippy from '@tippyjs/react';

export default function EventListItem({
  event,
}: {
  event: EventWithCreatorInfo;
}) {

  const slotsLeft = (event.slots || 0) - (event.sign_ups || 0)

  return (
    <Link
      href={`/events/${event.slug}`}
      key={event.slug}
      className={`p-3 rounded-lg hover:bg-gray-100 ${hasDatePassed(event.date_end) && 'grayscale opacity-80'} hover:grayscale-0 hover:opacity-100`}
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
              Upcoming
            </span>
          </div>
        )}

        <div className="absolute bottom-5 left-5 w-16 h-16">
          <div className="rounded-full absolute bottom-0 left-0 bg-white w-16 h-16"></div>
          <div className="rounded-full absolute bottom-9 left-9 bg-base-400 w-6 h-6"></div>

          <Tippy
            interactive={true}
            zIndex={100}
            className="bg-slate-800"
            delay={[100, 200]}
            appendTo={() => document.body}
            content={
              <Link
                href={`/profiles/${event?.created_by?.username}`}
                className="block p-4"
              >
                <div className="flex flex-row gap-3 items-center mb-5">
                  <Image
                    src={
                      event?.created_by?.avatar_url
                        ? `${BUCKET_URL}/avatars/${event.created_by.avatar_url}`
                        : '/users/placeholder-avatar.svg'
                    }
                    alt=""
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-[1rem]">
                      {event?.created_by?.name}
                    </div>
                    <div className="text-xs text-gray-400">Your host</div>
                  </div>
                </div>

                <dl className="flex flex-row gap-3">
                  <div className="">
                    <dt className="text-md font-extrabold text-slate-300">
                      {event?.created_by?.events_created}
                    </dt>
                    <dd className="text-slate-500 dark:text-gray-400 text-xs">
                      Events hosted
                    </dd>
                  </div>
                  <div className="">
                    <dt className="text-md font-extrabold text-slate-300">
                      {event?.created_by?.guests_hosted}
                    </dt>
                    <dd className="text-slate-500 dark:text-gray-400 text-xs">
                      Guests Hosted
                    </dd>
                  </div>
                </dl>
              </Link>
            }
          >
            <Image
              src={
                event?.created_by?.avatar_url
                  ? `${BUCKET_URL}/avatars/${event.created_by.avatar_url}`
                  : '/users/placeholder-avatar.svg'
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
          {event?.date_start &&
            event?.date_end &&
            formatDateRange(event.date_start, event.date_end)}
        </p>
        <p className="truncate text-sm mt-1">
          <span className="font-semibold uppercase mr-1">
            ${event.price} {event.price_currency}
          </span>
          {slotsLeft === 0 ? (
            <span className="inline-flex items-center bg-base-100 text-base-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-base-900 dark:text-base-300">
              Fully booked <svg className="inline-block ml-0.5" width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#991b1b" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#991b1b"></path></svg>
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              {slotsLeft} slots left
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
