import { Metadata } from 'next';
import {
  Event,
  ProfileWithEventsHosted,
  fetchProfileWithHostedEvents,
} from '@/app/_lib/actions';
import Image from 'next/image';
import EventListItemInProfile from './_components/EventListItemInProfile';

export const metadata: Metadata = {
  title: 'innercircle | Profile',
};

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = (await fetchProfileWithHostedEvents(
    params.slug,
  )) as ProfileWithEventsHosted;
  const hostedEvents = profile?.hosted_events as Event[];
  let gridCols = 0, isHost = false, isParticipant = false;
  if (profile?.user_roles?.includes('host')) {
    gridCols += 2;
    isHost = true;
  }
  if (profile?.user_roles?.includes('participant')) {
    gridCols += 1;
    isParticipant = true;
  }
  // const joined_events = profile?.joined_events as Event[];

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <Image
        src={
          profile?.avatar_url ? profile.avatar_url : '/users/placeholder-avatar.svg'
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
          return <div key={i} className="inline-block bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 capitalize">{role}</div>;
        })}
      </div>
      </div>

      <dl className={`grid max-w-screen-xl grid-cols-${gridCols} gap-8 py-2 px-4 mx-auto mb-8`}>
        {isHost && (
        <>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {hostedEvents?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Events hosted</dd>
        </div>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {hostedEvents?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Guests hosted</dd>
        </div>
        </>
        )}
        {isParticipant && (
          <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {profile?.joined_events_count}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Events participated</dd>
        </div>
        )}
      </dl>

{isHost && (
  <>
      <h2 className="font-bold text-xl mb-4">Events hosted</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hostedEvents?.map((event, i) => {
          return <EventListItemInProfile event={event} key={i} />;
        })}
      </div>
      </>
)}
    </div>
  );
}
