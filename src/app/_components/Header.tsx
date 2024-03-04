import Image from 'next/image';
import Link from 'next/link';
import AuthForm from './auth/auth-form';
import { FaInstagram } from 'react-icons/fa';
import { createClient } from '../_utils/supabase/server';
import { headers } from 'next/headers';

export default async function Header() {

  const supabase = createClient()
  const headersList = headers();
  const pathname = headersList.get("next-url");

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(user, pathname)

  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 gap-6 items-center">
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
          <div className="bg-gray-50 rounded-lg flex items-center px-1">
            <Link
              href="https://instagram.com/innercircle.fam"
              className="p-2 inline-block hover:bg-gray-100 rounded-lg"
              target="_blank"
            >
              <FaInstagram color="#464233" />
            </Link>
            <Link
              href="https://www.xiaohongshu.com/user/profile/5a7a6e4be8ac2b63699feebc"
              className="p-2 inline-block hover:bg-gray-100 rounded-lg group"
              target="_blank"
            >
              <Image
                src="/xiaohongshu.svg"
                width={20}
                height={20}
                className="grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                alt="小红书"
              />
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <AuthForm />
        </div>
      </nav>
    </header>
  );
}
