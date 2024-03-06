"use client"

import { User } from '@supabase/supabase-js';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RiLogoutCircleRLine, RiUser3Fill, RiUser4Fill } from "react-icons/ri";
import { FaRegCalendarCheck } from 'react-icons/fa6';
import Link from 'next/link';
import { Profile, signOut } from '../_lib/actions';


export default function LoggedInUser({ user }: { user: User }) {
  const profile = user?.user_metadata as Profile;

  return (
    <div>
      <Menu>
        <MenuButton className="rounded-full">
          <Avatar
            size="md"
            src={profile?.avatar_url || ''}
            bg="gray.100"
            icon={
              <RiUser4Fill className="fill-gray-500" />
            }
          />
        </MenuButton>
        <MenuList minWidth="150px">
          <MenuItem as={Link} href="/profile" icon={<RiUser3Fill className="fill-gray-500" />}>My Profile</MenuItem>
          <MenuItem as={Link} href="/my-events" icon={<FaRegCalendarCheck className="fill-gray-500" />}>My Events</MenuItem>
          <MenuDivider />
          <MenuItem icon={<RiLogoutCircleRLine className="fill-gray-500" />} onClick={async () =>  await signOut()}>Log out</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
