import Image from 'next/image';
import Link from 'next/link';
import AuthForm from './auth/auth-form';
import { createClient } from '../_utils/supabase/server';
import { headers } from 'next/headers';
import LoggedInUser from './LoggedInUser';

export default async function Header() {

  const supabase = createClient()
  const headersList = headers();
  const pathname = headersList.get("next-url");

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="max-w-6xl mx-auto">
      <nav
        className="flex items-center justify-between p-6"
        aria-label="Global"
      >
        <div className="flex lg:flex gap-6 items-center">
          <a href="/" className="-m-1.5 p-1.5">
            <Image
              className="relative"
              src="/logo.svg"
              alt="innercircle Logo"
              width={80}
              height={55}
              priority
            />
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-4 bg-gray-50 rounded-lg px-3 items-center text-sm">
          <div className="flex">
            <Link
              href="/events"
              type="button"
              className={`relative overflow-hidden px-5 py-2.5 text-center hover:bg-gray-100 rounded-md ${pathname === '/events' ? 'font-semibold' : ' text-gray-500'}`}
            >
              All events
              <div
                className={`w-1 h-1 rounded-full ${pathname === '/events' ? 'bg-base-500' : 'bg-transparent'} absolute bottom-0 left-1/2 transform`}
              />
            </Link>
            <Link
              href="/events?type=speed-dating"
              type="button"
              className={`relative overflow-hidden px-5 py-2.5 text-center hover:bg-gray-100 rounded-md ${pathname === '/events?type=speed-dating' ? 'font-semibold' : 'text-gray-500'}`}
            >
              Speed Dating
              <div
                className={`w-1 h-1 rounded-full ${pathname === '/events?type=speed-dating' ? 'bg-base-500' : 'bg-transparent'} absolute bottom-0 left-1/2 transform`}
              />
            </Link>
            <Link
              href="/events?type=retreats"
              type="button"
              className={`relative overflow-hidden px-5 py-2.5 text-center hover:bg-gray-100 rounded-md ${pathname === '/events?type=retreats' ? 'font-semibold' : 'text-gray-500'}`}
            >
              Retreats
              <div
                className={`w-1 h-1 rounded-full ${pathname === '/events?type=retreats' ? 'bg-base-500' : 'bg-transparent'} absolute bottom-0 left-1/2 transform`}
              />
            </Link>
          </div>
        </div>
        {user?.id ? <LoggedInUser user={user} /> : <AuthForm />}

      </nav>
    </header>
  );
}
