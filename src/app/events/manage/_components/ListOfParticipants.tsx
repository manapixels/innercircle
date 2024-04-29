import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ListOfParticipants = ({ participants }: { participants }) => {
  return (
    <ul>
      {participants.map((participant) => (
        <li key={participant.id}>
          <Link
            href={`/profiles/${participant.id}`}
            target="_blank"
            className="flex gap-2 p-4 border border-gray-200 rounded-lg mb-2"
          >
            <Image
              src={participant?.avatar_url || '/users/placeholder-avatar.svg'}
              alt={participant.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{participant.name}</div>
              <div className="text-sm text-gray-500">{participant.username}</div>
              <div>{participant?.tickets_bought} tickets</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListOfParticipants;
