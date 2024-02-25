import { Metadata } from "next";
import Events from '@/app/events/_components/events';

export const metadata: Metadata = {
  title: "innercircle | All events",
};

export default async function EventsPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-12 px-24">
      <Events />
    </div>
  );
}
