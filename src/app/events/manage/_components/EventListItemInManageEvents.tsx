import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BUCKET_URL } from '@/constants';
import {
  formatDateRange,
  hasDatePassed,
  timeBeforeEvent,
} from '@/helpers/date';
import { reverseSlugify } from '@/helpers/text';
import { EventWithParticipants } from '@/types/event';
import EditEventForm from './EditEventForm';
import ListOfParticipants from './ListOfParticipants';
import { updateEventStatus } from '@/api/event';
import { useToast } from '@/_components/ui/Toasts/useToast';

export default function EventListItemInMyEvents({
  event,
  updateEventInList,
  openModal,
  closeModal,
}: {
  event: EventWithParticipants;
  updateEventInList: (event: EventWithParticipants) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  const [status, setStatus] = useState<string>(event.status);
  const eventOver = hasDatePassed(event?.date_start);
  const ticketsLeft = (event.slots ?? 0) - (event.sign_ups ?? 0);
  const percentSold = event.slots ? (1 - ticketsLeft / event.slots) * 100 : 0;

  const { toast } = useToast();

  useEffect(() => {
    setStatus(event.status);
  }, [event.status]);

  useEffect(() => {
    const updateStatus = async () => {
      await updateEventStatus(event.id, status);
      toast({
        title: 'Success!',
        description: `Event status updated`,
        className: 'bg-green-700 text-white border-transparent',
      });
    };

    if (status !== event.status) {
      updateStatus();
    }
  }, [status]);

  const handleEditClick = () => {
    const modalContent = (
      <EditEventForm
        event={event}
        onSuccess={updateEventInList}
        closeModal={closeModal}
      />
    );
    openModal(modalContent);
  };

  const handleViewParticipantsClick = () => {
    const modalContent = (
      <ListOfParticipants participants={event.participants} />
    );
    openModal(modalContent);
  };

  return (
    <div>
      <div className={`relative flex gap-4 md:p-6 rounded-lg bg-white border`}>
        <div className="absolute top-0 right-0 hidden md:block">
          <span
            className={`block   text-sm font-medium px-4 py-1.5 rounded align-top ${eventOver ? 'bg-gray-100 text-gray-400' : 'bg-base-600 text-white'}`}
          >
            {eventOver
              ? 'Ended'
              : `${timeBeforeEvent(event?.date_start, event?.date_end)}`}
          </span>
        </div>

        <div className="w-32 md:w-auto relative aspect-square flex-shrink-0">
          {event?.image_thumbnail_url ? (
            <Image
              src={`${BUCKET_URL}/event_thumbnails/${event?.image_thumbnail_url}`}
              alt={`${event?.name}`}
              className="rounded-lg object-cover h-full bg-gray-200"
              width="170"
              height="170"
            />
          ) : (
            <div className="bg-gray-200 rounded-lg w-40 h-40 flex justify-center items-center">
              <Image
                src="/logo.svg"
                alt="Inner Circle"
                width="100"
                height="100"
                className="grayscale opacity-20"
              />
            </div>
          )}
        </div>

        <div className="min-w-0 py-2 flex-grow flex flex-col md:gap-4 justify-between">
          <div>
            {/* Event name & tags */}
            <div className="flex gap-4">
              <Link
                href={`/events/${event?.slug}`}
                className="truncate text-lg font-semibold mb-1"
              >
                {event?.name}
              </Link>
              <div className="items-center gap-2 mb-2 hidden md:block">
                {event?.category?.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {reverseSlugify(c)}
                  </span>
                ))}
              </div>
            </div>
            {/* Location */}
            {event?.location_name && event?.location_country ? (
              <div className="flex gap-1 items-center md:mb-3">
                <span>at</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name)},${encodeURIComponent(event.location_country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-base-600 group flex items-center gap-1"
                >
                  {event?.location_name}
                  <span className="hidden md:inline-block">
                    , {event?.location_country}
                  </span>
                  <svg
                    className="md:hidden group-hover:inline-block"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#927800"
                  >
                    <path
                      d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                      stroke="#927800"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>
              </div>
            ) : (
              <span className="text-sm text-gray-500 mb-3">
                {event?.location_name ? `${event?.location_name}, ` : ''}
                {event?.location_country}
              </span>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-3">
              <div className="flex gap-1 items-center">
                {event?.date_start && event?.date_end && (
                  <>
                    <div className="text-lg text-gray-800">
                      {formatDateRange(event?.date_start, event?.date_end)}
                    </div>
                    <div className="text-lg text-gray-600">
                      {new Date(event?.date_start).getFullYear()}
                    </div>
                  </>
                )}
              </div>
              <div className="hidden md:flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={handleViewParticipantsClick}
                  className={`inline-flex items-center gap-1 text-gray-500 text-sm`}
                >
                  Participants{' '}
                  <svg
                    className="inline-block align-middle"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#000000"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className={`inline-flex items-center gap-1 text-gray-500 text-sm ${eventOver ? 'text-gray-300 cursor-not-allowed' : ''}`}
                  disabled={eventOver}
                >
                  Edit{' '}
                  <svg
                    className="inline-block align-middle"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#000000"
                  >
                    <path
                      d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>

                {/* Update event status */}
                {(event.status !== 'completed' || !eventOver) && (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-base-500 focus:border-base-500 w-full p-2.5 dark:bg-gray-7000 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-base-500 dark:focus:border-base-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="reserving">Reserving</option>
                    <option value="reservations-closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            </div>
            <div>
              <div className="w-full bg-gray-200 rounded-full  dark:bg-gray-700 mb-3">
                <div
                  className={`${percentSold === 100 ? 'bg-gray-400' : 'bg-base-600'}  text-xs font-medium text-white text-center p-0.5 leading-none rounded-full min-w-28`}
                  style={{ width: `${percentSold}%` }}
                >
                  {ticketsLeft === 0
                    ? `Sold out ${event.sign_ups} tix 🎉`
                    : `${event?.sign_ups} sold / ${ticketsLeft} left`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`grid md:hidden ${eventOver ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <button
          type="button"
          onClick={handleViewParticipantsClick}
          className={`inline-flex items-center gap-1 text-base-700 text-sm p-4 bg-white border border-base-700 rounded-lg`}
        >
          Participants{' '}
          <svg
            className="inline-block align-middle"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000"
          >
            <path
              d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
              className="stroke-base-700"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleEditClick}
          className={`inline-flex items-center gap-1 text-base-700 text-sm p-4 bg-white border rounded-lg ${eventOver ? 'text-gray-400 cursor-not-allowed' : 'border-base-700'}`}
          disabled={eventOver}
        >
          Edit{' '}
          <svg
            className="inline-block align-middle"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000"
          >
            <path
              d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
              className={`${eventOver ? 'stroke-gray-400' : 'stroke-base-700'}`}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>

        {/* Update event status */}
        {(event.status !== 'completed' || !eventOver) && (
          <select
            className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-base-500 focus:border-base-500 w-full p-2.5 dark:bg-gray-7000 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-base-500 dark:focus:border-base-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="reserving">Reserving</option>
            <option value="reservations-closed">Closed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
}
