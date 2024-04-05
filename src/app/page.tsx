import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'innercircle | Home',
};

export default async function HomePage() {
  return (
    <div className="p-4 md:p-12 pb-0 md:pb-0 max-w-7xl mx-auto">
      <div className="max-w-md text-center mx-auto">
        
        <div className="text-6xl font-bold tracking-wide mb-4">Join our<br/>inner<div className="w-10 h-10 bg-base-300 rounded-full aspect-square inline-block mx-2"></div>circle</div>
        <p className="text-xl mb-8 text-gray-700">
          Welcome to our community where millennials unite to build connections, friendships, and empower each other.
        </p>
        <div className="flex gap-3 justify-center">
        <Link href='/events' className="px-5 py-3 text-base font-medium text-center text-white bg-base-700 rounded-full hover:bg-base-800 focus:ring-4 focus:outline-none focus:ring-base-300 dark:bg-base-600 dark:hover:bg-base-700 dark:focus:ring-base-800 italic">Find an event</Link>
        <Link href='/' className="px-5 py-3 text-base font-medium text-center text-base-700 border border-base-700 rounded-full hover:border-base-600 hover:text-base-600 focus:ring-4 focus:outline-none focus:ring-base-300 dark:text-base-600 dark:border-base-600 dark:hover:bg-base-600 dark:hover:text-white dark:focus:ring-base-800 italic">Join our <svg className="inline align-text-top" width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M21 5L2 12.5L9 13.5M21 5L18.5 20L9 13.5M21 5L9 13.5M9 13.5V19L12.2488 15.7229" stroke="#7A6400" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>Telegram group</Link>
        </div>
      </div>
    </div>
  );
}
