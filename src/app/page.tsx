import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'innercircle | Home',
};

export default async function HomePage() {
  return (
    <>
      <div className="p-4 md:p-12 pb-0 md:pb-0 max-w-7xl mx-auto">
        <div className="max-w-md text-center mx-auto ">
          <div className="text-6xl font-bold mb-4">
            Join our
            <br />
            inner
            <div className="w-10 h-10 bg-base-300 rounded-full aspect-square inline-block mx-2"></div>
            circle
          </div>
          <p className="text-xl mb-8 text-gray-700">
            Welcome to our community where millennials unite to build
            connections, friendships, and empower each other.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/events"
              className="px-5 py-3 text-base font-medium text-center text-white bg-base-700 rounded-full hover:bg-base-800 focus:ring-4 focus:outline-none focus:ring-base-300 dark:bg-base-600 dark:hover:bg-base-700 dark:focus:ring-base-800 italic"
            >
              Find an event
            </Link>
            <Link
              href="/"
              className="px-5 py-3 text-base font-medium text-center text-base-700 bg-white border border-base-700 rounded-full hover:border-base-600 hover:text-base-600 focus:ring-4 focus:outline-none focus:ring-base-300 dark:text-base-600 dark:border-base-600 dark:hover:bg-base-600 dark:hover:text-white dark:focus:ring-base-800 italic"
            >
              Join our{' '}
              <svg
                className="inline align-text-top"
                width="20px"
                height="20px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#000000"
              >
                <path
                  d="M21 5L2 12.5L9 13.5M21 5L18.5 20L9 13.5M21 5L9 13.5M9 13.5V19L12.2488 15.7229"
                  stroke="#7A6400"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              Telegram group
            </Link>
          </div>
        </div>
      </div>

      <div className="relative -z-[1]">
        <div className="border aspect-square border-base-300 rounded-full w-10/12 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed top-3/4 left-1/2 w-full transform -translate-x-1/2 flex items-center justify-center">
          <div className="border aspect-square border-base-300 bg-base-100 rounded-full w-9/12"></div>
          <div className="border aspect-square border-base-300 bg-white rounded-full w-7/12 absolute"></div>
        </div>
      </div>

    <div className="absolute inset-0 flex flex-wrap justify-center items-center -z-[1]">
      {Array.from({ length: 50 }).map((_, index) => {
        const widthHeight = Math.random() * 0.2 + 0.1;
        return (
        <div
          key={index}
          className="bg-base-300 rounded-full aspect-square"
          style={{
            width: `${widthHeight}rem`, // Random width between 2rem and 7rem
            height: `${widthHeight}rem`, // Random height between 2rem and 7rem
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `translate(-50%, -50%)`,
          }}
        ></div>
        )
      })}
    </div>
    </>
  );
}
