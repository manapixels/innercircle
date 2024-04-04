import { Metadata } from 'next';
import {
  ProfileWithEventsHosted,
  fetchProfileWithHostedEvents,
} from '@/app/_lib/actions';
import Image from 'next/image';

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
  return (
    <div className="flex w-full flex-col md:col-span-4">
        <div className="flex flex-row">
      <Image
        src={
          profile?.avatar_url ? profile.avatar_url : '/users/shirley-chen.png'
        }
        alt=""
        width={60}
        height={60}
        className="rounded-full mx-auto mb-1"
      />
      <div>
      <div className="font-medium">{profile?.name}</div>
      <div className="text-xs text-gray-400 mb-3">Your host</div>
      </div>
      </div>

      <div className="text-xs text-gray-300">Hosted</div>
      <dl className="grid max-w-screen-xl grid-cols-2 gap-8 py-2 px-4 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {profile?.events?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Events</dd>
        </div>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-xl font-extrabold">
            {profile?.events?.length}
          </dt>
          <dd className="text-gray-500 dark:text-gray-400 text-sm">Guests</dd>
        </div>
      </dl>
    </div>
  );
}
