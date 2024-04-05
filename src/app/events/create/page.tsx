import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'innercircle | Create event',
};

export default async function CreateEventPage() {

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        create event page
      </div>
    </div>
  );
}
