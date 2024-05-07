import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { AnimatePresence, motion } from 'framer-motion';

import { useToast } from '@/_components/ui/Toasts/useToast';
import { EventWithParticipants } from '@/types/event';
import { postEventToTelegram } from '@/api/event';
import { useUser } from '@/_contexts/UserContext';
import Spinner from '@/_components/ui/Spinner';

export default function PostToTelegram({
  event,
}: {
  event: EventWithParticipants;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useUser();

  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const handleConfirm = async () => {
    if (event?.id && profile?.id) {
      try {
        setIsLoading(true);
        await postEventToTelegram(event.id, profile);
        toast({
          title: 'Success!',
          description: 'Event posted to Telegram',
          className: 'bg-green-700 text-white border-transparent',
        });
      } catch (error) {
        toast({
          title: 'Error!',
          description: 'Failed to post event to Telegram',
          className: 'bg-red-700 text-white border-transparent',
        });
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      <div>
        <button className="" onClick={() => setIsOpen(true)}>
          <svg
            width="32px"
            height="32px"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000"
            className="fill-white"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M18 8L5 12.5L9.5 14M18 8L9.5 14M18 8L14 18.5L9.5 14"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <motion.div
          ref={ref}
          className={`origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          initial={{ opacity: 0 }}
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 },
          }}
          tabIndex={-1}
        >
          <button className="px-4 py-2" onClick={handleConfirm}>
            {isLoading && <Spinner className="mr-1.5" />}
            {isLoading ? 'Posting...' : 'Post to Telegram'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
