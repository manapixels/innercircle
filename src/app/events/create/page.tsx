import { Metadata } from 'next';
import CreateEventForm from './_components/CreateEventForm';

export const metadata: Metadata = {
  title: 'innercircle | Create event',
};

export default async function CreateEventPage() {
  return (
    <section className="bg-white dark:bg-gray-900 max-w-2xl py-4 px-4 mx-auto lg:py-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Create new event
      </h2>
      <CreateEventForm />
    </section>
  );
}
