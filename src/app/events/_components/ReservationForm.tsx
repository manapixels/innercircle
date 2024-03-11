'use client';

import { EventWithCreatorInfo } from '@/app/_lib/actions';
import { hasDatePassed } from '@/app/_utils/date';
import { useState } from 'react';

export default function ReservationForm({
  event,
}: {
  event: EventWithCreatorInfo;
}) {
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <div className="border p-8 rounded-2xl shadow-lg">
      <div className="text-xl font-medium mb-2">
        {event?.price
          ? <span><span className="uppercase">{event?.price_currency}</span> {event?.price} / person</span>
          : <span>Free</span>}
      </div>
      <div className="border flex justify-between items-center p-2 mb-4 rounded-lg relative">
        <span className="text-sm pl-1">Guests</span>

        <button
          type="button"
          id="decrement-button"
          data-input-counter-decrement="counter-input"
          className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
          onClick={() => {
            if (guests > 1) {
              setGuests(guests - 1);
            }
          }}
        >
          <svg
            className="w-2.5 h-2.5 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="text"
          id="counter-input"
          data-input-counter
          className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
          placeholder=""
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          required
        />
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="counter-input"
          className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
          onClick={() => setGuests(guests + 1)}
        >
          <svg
            className="w-2.5 h-2.5 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
      <button
        className={`bg-base-600 text-white px-4 py-2 rounded-lg w-full block ${
          hasDatePassed(event.date_start) ? 'opacity-50' : ''
        }`}
        disabled={hasDatePassed(event.date_start)}
      >
        {hasDatePassed(event.date_start) ? 'Event has passed' : 'Reserve'}
      </button>
    </div>
  );
}
