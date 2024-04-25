import { Metadata } from 'next';
import { fetchEvent } from '@/api/event';
import { BUCKET_URL } from '@/constants';
import { EventWithSignUps } from '@/types/event';
import { Profile } from '@/types/profile';
import ReservationForm from './_components/ReservationForm';

export const metadata: Metadata = {
  title: 'innercircle | Event',
};

export default async function EventDetailsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const event = (await fetchEvent(slug as string)) as EventWithSignUps;
  const host = event?.created_by as Profile & {
    events_created?: number;
    guests_hosted?: number;
  };

  return (
    <div>
      <div
        className={`w-full h-96 bg-gray-300 bg-center rounded-2xl ${event?.image_banner_url === '' ? 'grayscale opacity-5' : ''}`}
        style={{
          backgroundImage: `url(${event?.image_banner_url === '' ? '/logo.svg' : `${BUCKET_URL}/event_banners/${event?.image_banner_url}`})`,
        }}
      />

      <div className="flex items-center justify-between mt-8">
        <div className="w-1/2">
          <div className="text-3xl font-medium mb-2">{event?.name}</div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg
              className="fill-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12.003 11.73q.668 0 1.14-.475q.472-.475.472-1.143t-.475-1.14q-.476-.472-1.143-.472t-1.14.476q-.472.475-.472 1.143t.475 1.14q.476.472 1.143.472M12 21.019q-3.525-3.117-5.31-5.814q-1.786-2.697-1.786-4.909q0-3.173 2.066-5.234Q9.037 3 12 3t5.03 2.062q2.066 2.061 2.066 5.234q0 2.212-1.785 4.909q-1.786 2.697-5.311 5.814"
              ></path>
            </svg>
            <span className="ml-1">
              {event?.location_name}, {event?.location_country}
            </span>
          </div>
          <div className="border border-gray-200 px-5 py-3 mb-4 rounded-lg flex items-center font-medium text-sm">
            Hosted by{' '}
            {host?.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full mx-2"
                src={`${BUCKET_URL}/avatars/${host?.avatar_url}`}
                alt=""
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  className="fill-gray-700"
                  d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
                ></path>
              </svg>
            )}
            {host?.name}
          </div>
          <div>{event?.description}</div>
        </div>
        <div className="w-1/3">
          <ReservationForm event={event} />
        </div>
      </div>
    </div>
  );
}
