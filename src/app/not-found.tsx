import Link from 'next/link';
import { RiHomeHeartLine } from 'react-icons/ri';

export default async function NotFound() {
  return (
    <div>
      <div className="xl:pt-24 w-full max-w-lg xl:w-1/2 relative pb-12 lg:pb-0 mx-auto">
        <div className="text-9xl font-bold text-yellow-500">404</div>
        <h1 className="my-2 text-gray-800 font-bold text-2xl">
          Looks like you've hit a roadblock.
        </h1>
        <p className="mb-4 text-gray-800">
          Unfortunately, it's not the kind leading to hidden treasure.😳
        </p>
        <Link
          href="/"
          className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-yellow-500 text-white hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 block"
        >
          Let's head back Home{' '}
          <RiHomeHeartLine style={{ display: 'inline-block' }} />
        </Link>
      </div>
    </div>
  );
}
