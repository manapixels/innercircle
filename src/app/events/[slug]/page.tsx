import { EventWithCreatorInfo, fetchEvent } from '@/app/_lib/actions';
import { Avatar } from '@chakra-ui/react';
import { Metadata } from 'next';
import { GrLocation } from 'react-icons/gr';
import { RiUser4Fill } from 'react-icons/ri';
import ReservationForm from '../_components/ReservationForm';

export const metadata: Metadata = {
  title: 'innercircle | Event',
};

export default async function EventDetailsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const event = (await fetchEvent(slug as string)) as EventWithCreatorInfo;

  return (
    <div>
      <div
        className="w-full h-96 bg-gray-200 rounded-2xl"
        style={{ backgroundImage: `url(${event?.image_url})` }}
      />

      <div className="flex items-center justify-between mt-8">
        <div className="w-1/2">
          <div className="text-3xl font-medium mb-2">{event?.name}</div>
          <div className="flex items-center text-gray-600 mb-4">
            <GrLocation className="fill-gray-600" />
            <span className="ml-1">{event?.location}, {event?.location_country}</span>
          </div>
          <div className="border border-gray-200 px-5 py-3 rounded-lg flex items-center font-medium text-sm">
            Hosted by{' '}
            <Avatar
              size="sm"
              src={event?.created_by.avatar_url || ''}
              bg="gray.100"
              className="mx-2"
              icon={<RiUser4Fill className="fill-gray-500" />}
            />
            {event?.created_by.name}
          </div>
          <div>{event?.description}</div>
        </div>
        <div className="w-1/3">
          <ReservationForm event={event} /> 
        </div>
      </div>
    </div>
  );
}
