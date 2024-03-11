'use client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Profile, signOut } from '../_lib/actions';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function LoggedInUser({ user }: { user: User }) {
  const profile = user?.user_metadata as Profile;
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <AnimatePresence initial={false} mode="wait">
      <div>
        <div className="relative inline-block text-left">
          <button className="rounded-full focus:outline-none focus:ring">
            <span className="sr-only">Open options</span>

            <motion.button
              className="rounded-full bg-gray-100 flex items-center justify-center"
              style={{ width: '3rem', height: '3rem' }}
              whileHover={{ scale: 1.08, backgroundColor: 'rgb(232 235 239)' }}
              onClick={() => setIsOpen(true)}
            >
              {profile?.avatar_url ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={profile?.avatar_url || ''}
                  alt=""
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="fill-gray-700"
                    d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
                  ></path>
                </svg>
              )}
            </motion.button>
          </button>
          <motion.div
            ref={ref}
            className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            initial={{ opacity: 0 }}
            animate={isOpen ? 'open' : 'closed'}
            variants={{
              open: { opacity: 1 },
              closed: { opacity: 0 },
            }}
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <Link
                href="/profile"
                className="text-gray-700 px-4 py-2 text-sm flex gap-1 hover:bg-gray-50"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1rem"
                  height="1.1rem"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path
                    className="fill-gray-700"
                    d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
                  />
                </svg>
                My Profile
              </Link>
              <Link
                href="/my-events"
                className="text-gray-700 px-4 py-2 text-sm flex gap-1 hover:bg-gray-50"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1rem"
                  height="1.1rem"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path
                    className="fill-gray-700"
                    d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5zm0 0V6zm7 6q-.425 0-.712-.288T11 13q0-.425.288-.712T12 12q.425 0 .713.288T13 13q0 .425-.288.713T12 14m-4 0q-.425 0-.712-.288T7 13q0-.425.288-.712T8 12q.425 0 .713.288T9 13q0 .425-.288.713T8 14m8 0q-.425 0-.712-.288T15 13q0-.425.288-.712T16 12q.425 0 .713.288T17 13q0 .425-.288.713T16 14m-4 4q-.425 0-.712-.288T11 17q0-.425.288-.712T12 16q.425 0 .713.288T13 17q0 .425-.288.713T12 18m-4 0q-.425 0-.712-.288T7 17q0-.425.288-.712T8 16q.425 0 .713.288T9 17q0 .425-.288.713T8 18m8 0q-.425 0-.712-.288T15 17q0-.425.288-.712T16 16q.425 0 .713.288T17 17q0 .425-.288.713T16 18"
                  ></path>
                </svg>
                My Events
              </Link>
              <hr className="my-2" />
              <button
                type="button"
                className="text-gray-700 px-4 py-2 text-sm flex gap-1 w-full hover:bg-gray-50"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-3"
                onClick={async () => await signOut()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1rem"
                  height="1.1rem"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path
                    className="fill-gray-700"
                    d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5"
                  ></path>
                  <path
                    className="fill-gray-700"
                    d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19z"
                  ></path>
                </svg>
                Log out
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
