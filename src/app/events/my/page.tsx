import { Metadata } from 'next';
import EventListInMyEvents from './_components/EventListInMyEvents';
import ProtectedWrapper from '@/_components/auth/ProtectedWrapper';

export const metadata: Metadata = {
  title: 'innercircle | Profile',
};

export default async function ProfilePage() {
  return (
    <ProtectedWrapper>
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className="font-bold text-xl mb-4">Manage My Events</h2>

        <EventListInMyEvents />
      </div>
    </ProtectedWrapper>
  );
}
