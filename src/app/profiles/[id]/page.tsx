import { Metadata } from 'next';
import {
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
  params: { id: string };
}) {
  const profile = (await fetchProfileWithHostedEvents(
    params.id,
  )) as ProfileWithEventsHosted;
  const events = profile?.events;

  return (
    <div className="flex w-full flex-col md:col-span-4">

      <Image
        src={
          profile?.avatar_url ? profile.avatar_url : '/users/shirley-chen.png'
        }
        alt=""
        width={140}
        height={140}
        className="rounded-full mx-auto mb-6"
      />
      <div className="text-center mb-8">
        <div className="italic text-gray-500">Hey there, I'm</div>
      <div className="font-bold text-2xl">{profile?.name}</div>
      </div>

      <dl className="grid max-w-screen-xl grid-cols-2 gap-8 py-2 px-4 mx-auto mb-8">
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {profile?.events?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Events hosted</dd>
        </div>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {profile?.events?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Guests hosted</dd>
        </div>
      </dl>

      <h2 className="font-bold text-xl mb-4">Events hosted</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events?.map((event, i) => {
          return <EventListItemInProfile event={event} key={i} />;
        })}
      </div>
    </div>
  );
}
