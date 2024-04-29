'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/_components/ui/Modal';
import { useUser } from '@/_contexts/UserContext';
import { fetchHostedEvents } from '@/api/event';
import { EventWithParticipants } from '@/types/event';
import EventListItemInManageEvents from './EventListItemInManageEvents';
import { hasDatePassed } from '@/helpers/date';

export default function EventListInMyEvents() {
  const { user } = useUser();
  const [pastEvents, setPastEvents] = useState<EventWithParticipants[]>([]);
  const [futureEvents, setFutureEvents] = useState<EventWithParticipants[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        const result = await fetchHostedEvents(user.id);
        if (result) {
          const events = result as EventWithParticipants[];

          console.log(events)

          setPastEvents(
            events.filter(
              (event) => event.date_end && hasDatePassed(event.date_end),
            ),
          );
          setFutureEvents(
            events.filter(
              (event) => event.date_end && !hasDatePassed(event.date_end),
            ),
          );
        }
      }
    };
    fetchEvents();
  }, [user]);

  const updateEventInList = (updatedEvent: EventWithParticipants) => {
    const updateList = (events: EventWithParticipants[]) =>
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      );
    setPastEvents((currentEvents) => updateList(currentEvents));
    setFutureEvents((currentEvents) => updateList(currentEvents));
  };

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className={`grid grid-cols-1 gap-6 bg-gray-50 rounded-2xl p-8`}>
      <div>
        <h2 className="font-medium text-xl mb-4">Upcoming Events</h2>
        {futureEvents.map((event, i) => (
          <EventListItemInManageEvents
            event={event}
            key={i}
            updateEventInList={updateEventInList}
            openModal={openModal}
            closeModal={closeModal}
          />
        ))}
      </div>
      <div>
        <h2 className="font-medium text-xl mb-4">Past Events</h2>
        {pastEvents.map((event, i) => (
          <EventListItemInManageEvents
            event={event}
            key={i}
            updateEventInList={updateEventInList}
            openModal={openModal}
            closeModal={closeModal}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} handleClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
}
