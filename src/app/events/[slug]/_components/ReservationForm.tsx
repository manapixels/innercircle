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
  const [loading, setLoading] = useState(false);
  const { profile } = useUser();

  const router = useRouter();
  const { toast } = useToast();

  const eventOver = hasDatePassed(event?.date_start);
  const slotsLeft = event?.slots ? event.slots - (event.sign_ups || 0) : 0;
  const exceedCapacity = slotsLeft - guests < 0;
  const reservationClosed =
    event.status !== 'reserving' || eventOver || exceedCapacity;

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

      // Signs user up for event but set has_paid to false
      const reservationId = await signUpForEvent(event.id, profile.id, guests);

      // Create a checkout request from Stripe
      const { errorMessage: errorMessageCheckout, sessionId } =
        await checkoutWithStripe(
          event?.price_stripe_id, // price
          guests, // quantity
          reservationId,
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
    <div className="border border-base-700 md:border-gray-200 p-8 rounded-2xl shadow-lg">
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

      {!reservationClosed && (
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
          className={`flex-shrink-0 bg-gray-100 ${guests === 1 || reservationClosed ? 'pointer-events-none' : 'hover:bg-gray-200 focus:ring-2'} inline-flex items-center justify-center border border-gray-300 rounded-lg md:rounded-md h-8 w-8 focus:ring-gray-100 focus:outline-none`}
          onClick={() => {
            if (guests > 1) {
              setGuests(guests - 1);
            }
          }}
          disabled={guests === 1 || reservationClosed}
        >
          <svg
            className={`w-2.5 h-2.5 text-gray-900 dark:text-white ${guests === 1 || reservationClosed ? 'opacity-50' : ''}`}
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
          disabled={reservationClosed}
          required
        />
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="counter-input"
          className={`flex-shrink-0 bg-gray-100 inline-flex items-center justify-center border border-gray-300 rounded-lg md:rounded-md h-8 w-8 focus:ring-gray-100  focus:outline-none ${reservationClosed ? 'pointer-events-none' : 'hover:bg-gray-200 focus:ring-2'}`}
          onClick={() => setGuests(guests + 1)}
          disabled={reservationClosed}
        >
          <svg
            className={`w-2.5 h-2.5 text-gray-900 dark:text-white ${reservationClosed ? 'opacity-50' : ''}`}
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
        className={`bg-base-600 text-white px-12 py-3 rounded-full w-full block ${
          loading || reservationClosed ? 'opacity-50' : ''
        }`}
        disabled={loading || reservationClosed}
        onClick={handleReservation}
      >
        {loading
          ? 'Processing...'
          : reservationClosed
            ? 'Reservations closed'
            : 'Reserve'}
      </button>
    </div>
  );
}
