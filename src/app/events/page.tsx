import { Metadata } from "next";
import Events from '@/app/events/ui/events';
import { fetchEvents } from "../lib/data";

export const metadata: Metadata = {
  title: "innercircle | All events",
};

export default async function EventsPage() {

  const events = await fetchEvents();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      events page

      {events.length}
      <Events events={events} />
    </div>
  );
}
