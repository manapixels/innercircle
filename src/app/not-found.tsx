import Image from 'next/image';
import Link from 'next/link';
import { RiHomeHeartLine } from 'react-icons/ri';


export default async function NotFound() {
  return (
    <div>
      <div className="xl:pt-24 w-full max-w-lg xl:w-1/2 relative pb-12 lg:pb-0 mx-auto">
        <div className="relative">
          <div className="text-9xl font-bold text-white absolute bottom-0">
            404
          </div>
          <Image
            src="/not-found.png"
            alt="Not found"
            width={250}
            height={250}
            className="rounded-xl"
          />
        </div>
        <h1 className="my-2 text-gray-800 font-bold text-2xl">
          Our pup found a chest!
        </h1>
        <p className="mb-4 text-gray-800">
          But it isn't the one you were looking for 🫠
        </p>
        <Link
          href="/"
          className="sm:w-full lg:w-auto my-2 border rounded-xl md py-4 px-8 text-center bg-base-100 text-black font-bold hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 block"
        >
          Go back home <RiHomeHeartLine style={{ display: 'inline-block' }} />
        </Link>
      </div>
    </div>
  );
}
