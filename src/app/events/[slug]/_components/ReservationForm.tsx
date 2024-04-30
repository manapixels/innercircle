'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import pluralize from 'pluralize';

import { useUser } from '@/_contexts/UserContext';
import { hasDatePassed } from '@/helpers/date';
import { getSuccessRedirect } from '@/helpers/misc';
import { EventWithSignUps } from '@/types/event';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { useToast } from '@/_components/ui/Toasts/useToast';
import { signUpForEvent } from '@/api/event';

export default function ReservationForm({
  event,
}: {
  event: EventWithSignUps;
}) {
  const [guests, setGuests] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = useUser();

  const router = useRouter();
  const { toast } = useToast();

  const eventOver = hasDatePassed(event?.date_start);

  const handleReservation = async () => {
    try {
      if (!profile?.id) {
        toast({
          title: 'Error',
          description: 'You must be logged in to make a reservation.',
          className: 'bg-red-700 text-white border-transparent',
        });
        return;
      }
      if (!event?.id) {
        toast({
          title: 'Error',
          description: 'This event does not have a price set.',
          className: 'bg-red-700 text-white border-transparent',
        });
        return;
      }

      if (!event?.price_stripe_id) {
        toast({
          title: 'Error',
          description: 'This event does not have a price set.',
          className: 'bg-red-700 text-white border-transparent',
        });
        return;
      }

      setLoading(true);

      // Create a checkout request from Stripe
      const { errorMessage: errorMessageCheckout, sessionId } =
        await checkoutWithStripe(
          event?.price_stripe_id, // price
          guests, // quantity
          getSuccessRedirect('/events/my', 'Reservation successful.'),
        );

      if (errorMessageCheckout) {
        toast({
          title: 'Error',
          description: errorMessageCheckout,
          className: 'bg-red-700 text-white border-transparent',
        });
      }

      if (sessionId) {
        // Signs user up for event but set has_paid to false
        await signUpForEvent(event.id, sessionId, profile.id, guests);

        // Redirects user to Stripe checkout
        const stripe = await getStripe();
        const result = await stripe?.redirectToCheckout({ sessionId });

        if (result?.error) {
          toast({
            title: 'Error',
            description: 'Failed to sign up for the event. Please try again.',
            className: 'bg-red-700 text-white border-transparent',
          });
          console.log(result.error);
        } else {
          router.push(
            '/events/my?success=true&message=Reservation%20successful.',
          );
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create a Stripe session. Please try again.',
          className: 'bg-red-700 text-white border-transparent',
        });
      }
    } catch (error) {
      console.error('Reservation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-8 rounded-2xl shadow-lg">
      {isConfirming ? (
        <>
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <button
              className="flex-shrink-0 bg-white hover:bg-gray-100 inline-flex items-center justify-center border border-gray-400 rounded-md h-8 w-8 focus:ring-gray-100 focus:ring-2 focus:outline-none p-1"
              onClick={() => setIsConfirming(false)}
            >
              <svg
                className="fill-gray-500"
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
            </>
          )}

          <div className="border flex justify-between items-center p-2 rounded-lg relative">
            <button
              type="button"
              id="decrement-button"
              data-input-counter-decrement="counter-input"
              className={`flex-shrink-0 bg-gray-100 ${guests === 1 || eventOver ? 'pointer-events-none' : 'hover:bg-gray-200 focus:ring-2'} inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 focus:outline-none`}
              onClick={() => {
                if (guests > 1) {
                  setGuests(guests - 1);
                }
              }}
              disabled={eventOver}
            >
              <svg
                className={`w-2.5 h-2.5 text-gray-900 dark:text-white ${guests === 1 || eventOver ? 'opacity-50' : ''}`}
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
          {/* )} */}

          <div className="flex justify-center my-4">
            <div className="border-t border-gray-300 w-20"></div>
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
              eventOver || loading ? 'opacity-50' : ''
            }`}
            disabled={eventOver || loading}
            onClick={handleReservation}
          >
            {loading
              ? 'Processing...'
              : eventOver
                ? 'Event has passed'
                : 'Reserve'}
          </button>
        </>
      )}
    </div>
  );
}
