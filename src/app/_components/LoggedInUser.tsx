"use client"

import { User } from '@supabase/supabase-js';
import { UserType, signOut } from '../_lib/actions';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RiLogoutCircleRLine, RiUser3Fill, RiUser4Fill } from "react-icons/ri";
import Link from 'next/link';

export default function LoggedInUser({ user }: { user: User }) {
  const profile = user?.user_metadata as UserType;

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
          <MenuItem as={Link} href="/profile" icon={<RiUser3Fill />}>My Profile</MenuItem>
          <MenuItem icon={<RiLogoutCircleRLine />} onClick={async () =>  await signOut()}>Log out</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
