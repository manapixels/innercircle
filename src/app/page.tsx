import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'innercircle | Home',
};

export default async function HomePage() {
  return (
    <div className="p-4 md:p-12 pb-0 md:pb-0 max-w-7xl mx-auto">
      <div className="max-w-md text-center mx-auto">
        <div className="w-12 h-12 bg-base-300 rounded-full mx-auto mb-12"></div>
        <p className="text-2xl font-bold mb-4 italic">
          A social initiative started to help millennials foster connections and
          craft relationships in a dynamic era.
        </p>
        <p>
          Join us as we embark on a journey of growth, friendship, and
          collective empowerment.
        </p>
        <Image
          src="/art/raise-hands-2.jpg"
          alt=""
          className="w-200 max-w-full mx-auto"
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}
