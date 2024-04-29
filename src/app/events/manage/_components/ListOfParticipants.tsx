import { Profile } from '@/types/profile';
import Link from 'next/link';
import React from 'react';

const ListOfParticipants = ({ participants }: { participants: Profile[] }) => {
  return (
    <ul>
      {participants.map((participant) => (
        <li key={participant.id}>
          <Link href={`/profile/${participant.id}`} target="_blank">
            {participant.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListOfParticipants;
