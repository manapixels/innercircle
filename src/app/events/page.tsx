import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "innercircle | All events",
};

export default function Events() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      events page
    </div>
  );
}
