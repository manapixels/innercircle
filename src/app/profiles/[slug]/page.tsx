import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { fetchUserProfileWithEvents } from '@/api/profile';
import { ProfileWithEvents } from '@/types/profile';
import { EventWithSignUps } from '@/types/event';
import { BUCKET_URL } from '@/constants';
import { createClient } from '@/utils/supabase/server';
import EventListItemInProfile from './_components/EventListItemInProfile';

export const metadata: Metadata = {
  title: 'innercircle | Profile',
};

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const profile = (await fetchUserProfileWithEvents({
    username: params.slug,
  })) as ProfileWithEvents;

  const hostedEvents = profile?.events_hosted as EventWithSignUps[];
  let gridCols = 0,
    isHost = false,
    isParticipant = false;
  if (profile?.user_roles?.includes('host')) {
    gridCols += 2;
    isHost = true;
  }
  if (profile?.user_roles?.includes('participant')) {
    gridCols += 1;
    isParticipant = true;
  }

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <Image
        src={
          profile.avatar_url !== ''
            ? `${BUCKET_URL}/avatars/${profile?.avatar_url}`
            : '/users/placeholder-avatar.svg'
        }
        alt=""
        width={140}
        height={140}
        className="rounded-full mx-auto mb-6"
      />
      <div className="text-center mb-8">
        <div className="italic text-gray-500">Hey there, I'm</div>
        <div className="font-bold text-2xl">{profile?.name}</div>
        <div>
          {profile?.user_roles?.map((role, i) => {
            return (
              <div
                key={i}
                className="inline-block bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 capitalize"
              >
                {role}
              </div>
            );
          })}
        </div>
      </div>

      <dl
        className={`grid max-w-screen-xl grid-cols-${gridCols} gap-8 py-2 px-4 mx-auto mb-8`}
      >
        {isHost && (
          <>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-xl font-extrabold">
                {hostedEvents?.length}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400 text-sm">
                Events hosted
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-xl font-extrabold">
                {profile?.guests_hosted}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400 text-sm">
                Guests hosted
              </dd>
            </div>
          </>
        )}
        {isParticipant && (
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-xl font-extrabold">
              {profile?.events_joined_count}
            </dt>
            <dd className="text-gray-500 dark:text-gray-400 text-sm">
              Events participated
            </dd>
          </div>
        )}
      </dl>

      {isHost && (
        <>
          <div
            className={`font-bold text-xl mb-4 flex justify-between items-center`}
          >
            <h2>Events hosted</h2>
            {user?.user?.id === profile?.id && (
              <Link
                href="/events/manage"
                className="flex items-center gap-1 text-white bg-base-700 hover:bg-base-600 font-medium text-base rounded-full px-7 py-2.5"
              >
                Manage my events{' '}
                <svg
                  className="inline-block"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#FFFFFF"
                >
                  <path
                    d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hostedEvents?.map((event, i) => (
              <EventListItemInProfile event={event} key={event.id || i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
