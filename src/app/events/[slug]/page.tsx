import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'innercircle | Event',
};

export default async function EventDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 max-w-7xl mx-auto">
      event details page
    </div>
  );
}
