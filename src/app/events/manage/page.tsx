import { Metadata } from 'next';
import ProtectedWrapper from '@/_components/auth/ProtectedWrapper';
import EventListInMyEvents from './_components/EventListInManageEvents';

export const metadata: Metadata = {
  title: 'innercircle | Manage Events',
};

export default async function ManageEventsPage() {
  return (
    <ProtectedWrapper>
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className="font-bold text-xl mb-4">Manage My Events</h2>
        <EventListInMyEvents />
      </div>
    </ProtectedWrapper>
  );
}
