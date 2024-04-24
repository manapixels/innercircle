'use client';

import { useState } from 'react';
import pluralize from 'pluralize';

import { useUser } from '@/_contexts/UserContext';
import { EventWithSignUps } from '@/_lib/actions';
import { hasDatePassed } from '@/_lib/_utils/date';
import { getStripe } from '@/_lib/_utils/stripe/client';
import { checkoutWithStripe } from '@/_lib/_utils/stripe/server';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/_components/ui/use-toast';

export default function ReservationForm({
  event,
}: {
  event: EventWithSignUps;
}) {
  const [isGroup, setIsGroup] = useState(false);
  const [guests, setGuests] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = useUser();

  const router = useRouter();
  const currentPath = usePathname();
  const { toast } = useToast();

  const eventOver = hasDatePassed(event?.date_start);

  const handleReservation = async () => {
    if (!profile?.id) {
      alert('You must be logged in to make a reservation.');
      return;
    }
    if (!event?.id) {
      alert('Event id is undetected');
      return;
    }

    setLoading(true);

    const { sessionId } = await checkoutWithStripe(
      event.price_stripe_id, // price
      guests, // quantity
      currentPath // redirectPath
    );

    if (sessionId) {

      const stripe = await getStripe();
      const result = await stripe?.redirectToCheckout({ sessionId });

      if (result?.error) {
        toast({
          title: "Error",
          description: 'Failed to sign up for the event. Please try again.',
          className: 'bg-red-700 text-white border-transparent',
        });
        console.log(result.error)
      } else {
        toast({
          title: "Successful!",
          description: 'You have signed up for the event!',
          className: 'bg-green-700 text-white border-transparent',
        });
        router.push('/events/my')
      }
    }

    // const result = await signUpForEvent(event.id, profile.id, guests);
    setLoading(false);

  };

  return (
    <div className="border p-8 rounded-2xl shadow-lg">
      {isConfirming ? (
        <>
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <button className="flex-shrink-0 bg-white hover:bg-gray-100 inline-flex items-center justify-center border border-gray-400 rounded-md h-8 w-8 focus:ring-gray-100 focus:ring-2 focus:outline-none p-1">
              <svg
                className="fill-gray-500"
                onClick={() => setIsConfirming(false)}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12q0 .425-.288.713T19 13z"
                ></path>
              </svg>
            </button>
            Order summary
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-between mb-6">
            <span>
              {guests}x {event?.name} {pluralize('Ticket', guests)}
            </span>
            <span>
              {event?.price ? (
                <span>
                  <span className="uppercase">{event?.price_currency}</span>{' '}
                  {event?.price * guests}
                </span>
              ) : (
                <span>Free</span>
              )}
            </span>
          </div>
          <div className="text-lg font-medium flex items-center justify-between mb-4">
            <span>Total</span>
            <span>
              {event?.price ? (
                <span>
                  <span className="uppercase">{event?.price_currency}</span>{' '}
                  {event?.price * guests}
                </span>
              ) : (
                <span>Free</span>
              )}
            </span>
          </div>
          <button
            className={`bg-base-600 text-white px-4 py-2 rounded-lg w-full block ${
              hasDatePassed(event?.date_start) || loading ? 'opacity-50' : ''
            }`}
            disabled={hasDatePassed(event?.date_start) || loading}
            onClick={handleReservation}
          >
            {loading
              ? 'Processing...'
              : eventOver
                ? 'Event has passed'
                : 'Reserve'}
          </button>
        </>
      ) : (
        <>
          <div className="text-xl font-medium mb-2">
            {event?.price ? (
              <span>
                <span className="uppercase">{event?.price_currency}</span>{' '}
                {event?.price} / person
              </span>
            ) : (
              <span>Free</span>
            )}
          </div>

          <div className="my-4 border-b"></div>

          {!eventOver && (
            <>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Booking for
              </h3>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg sm:flex dark:bg-gray-700 dark:text-white">
                <li
                  className={`w-full border-2 rounded-md ${isGroup ? 'border-base-600' : 'border-gray-200'} dark:border-gray-600`}
                >
                  <div className="flex items-center ps-3">
                    <div
                      className={`relative w-4 h-4 rounded-full border ${!isGroup ? 'bg-base-600 border-base-600' : 'bg-gray-100 border-gray-300'} focus:ring-white dark:focus:ring-base-600 dark:ring-offset-gray-7000 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500 aspect-square`}
                      onClick={() => {
                        setIsGroup(false);
                        setGuests(1);
                      }}
                    >
                      {!isGroup && (
                        <div className="absolute inset-0 rounded-full bg-base-600"></div>
                      )}
                    </div>
                    <label
                      htmlFor="horizontal-list-radio-1"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                      onClick={() => {
                        setIsGroup(false);
                        setGuests(1);
                      }}
                    >
                      Myself
                    </label>
                  </div>
                </li>
                <li
                  className={`w-full border-2 rounded-md ${isGroup ? 'border-base-600' : 'border-gray-200'} dark:border-gray-600`}
                >
                  <div className="flex items-center ps-3">
                    <div
                      className={`relative w-4 h-4 rounded-full border ${isGroup ? 'bg-base-600 border-base-600' : 'bg-gray-100 border-gray-300'} focus:ring-white dark:focus:ring-base-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:border-gray-500 aspect-square`}
                      onClick={() => {
                        setIsGroup(true);
                        setGuests(2);
                      }}
                    >
                      {isGroup && (
                        <div className="absolute inset-0 rounded-full bg-base-600"></div>
                      )}
                    </div>
                    <label
                      htmlFor="horizontal-list-radio-group"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                      onClick={() => {
                        setIsGroup(true);
                        setGuests(2);
                      }}
                    >
                      Group
                    </label>
                  </div>
                </li>
              </ul>
            </>
          )}

          {guests > 1 && (
            <div className="border flex justify-between items-center p-2 rounded-lg relative">
              {/* <span className="text-sm pl-1">Guests</span> */}

              <button
                type="button"
                id="decrement-button"
                data-input-counter-decrement="counter-input"
                className={`flex-shrink-0 bg-gray-100 ${guests === 2 || eventOver ? 'pointer-events-none' : 'hover:bg-gray-200 focus:ring-2'} inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 focus:outline-none`}
                onClick={() => {
                  if (guests > 2) {
                    setGuests(guests - 2);
                  }
                }}
                disabled={eventOver}
              >
                <svg
                  className={`w-2.5 h-2.5 text-gray-900 dark:text-white ${guests === 2 || eventOver ? 'opacity-50' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
                disabled={eventOver}
                required
              />
              <button
                type="button"
                id="increment-button"
                data-input-counter-increment="counter-input"
                className={`flex-shrink-0 bg-gray-100 inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100  focus:outline-none ${eventOver ? 'pointer-events-none' : 'hover:bg-gray-200 focus:ring-2'}`}
                onClick={() => setGuests(guests + 1)}
                disabled={eventOver}
              >
                <svg
                  className={`w-2.5 h-2.5 text-gray-900 dark:text-white ${eventOver ? 'opacity-50' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          )}

          <button
            className={`bg-base-600 text-white mt-5 px-4 py-2 rounded-lg w-full block ${
              hasDatePassed(event?.date_start) || loading ? 'opacity-50' : ''
            }`}
            disabled={hasDatePassed(event?.date_start) || loading}
            onClick={() => setIsConfirming(true)}
          >
            {hasDatePassed(event?.date_start) ? 'Event has passed' : 'Next'}
          </button>
        </>
      )}
    </div>
  );
}
