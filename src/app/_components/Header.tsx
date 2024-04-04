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
    <header className="max-w-6xl w-full mx-auto">
      <nav
        className="grid grid-cols-3 items-center p-6"
        aria-label="Global"
      >
        <div className="justify-self-start">
          <a href="/" className="-m-1.5 p-1.5 block">
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
        <div className="justify-self-center bg-gray-50 rounded-full text-sm">
          <Link
            href="/events"
            className={`block relative overflow-hidden px-5 py-2.5 text-center hover:bg-gray-100 rounded-full font-medium text-gray-600 ${pathname === '/events' ? 'bg-gray-200 font-semibold text-gray-800' : ' '}`}
          >
            Events
            <div
              className={`w-1 h-1 rounded-full ${pathname === '/events' ? 'bg-base-500' : 'bg-transparent'} absolute bottom-0 left-1/2 transform`}
            />
          </Link>
        </div>
        <div className="justify-self-end">
          {user?.id ? <LoggedInUser user={user} /> : <AuthForm />}
        </div>
      </nav>
    </header>
  );
}
