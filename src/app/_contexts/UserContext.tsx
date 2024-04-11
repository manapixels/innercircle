'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';

import { User } from '@supabase/supabase-js';
import { createClient } from '../_utils/supabase/client';
import { ProfileWithRoles, fetchUserProfile } from '../_lib/actions';

const supabase = createClient();
const UserContext = createContext<{
  user: User | undefined;
  profile: ProfileWithRoles | undefined;
  setUser: (user: User | undefined) => void;
}>({ user: undefined, profile: undefined, setUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [profile, setProfile] = useState<ProfileWithRoles>();
  const listenerRegistered = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error)
          throw new Error(
            `[UserContext] Failed to fetch user: ${error.message}`,
          );
        if (data?.user) {
          setUser(data.user);
          callAndSetProfile(data.user.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!listenerRegistered.current) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log(`Auth event: ${event}`);
          if (session?.user) {
            setUser(session.user);
            callAndSetProfile(session.user.id);
          }
        },
      );

      listenerRegistered.current = true;

      // Cleanup function to unsubscribe from the auth state change listener
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }

    initializeUser();
  }, []);

  const callAndSetProfile = async (userId: string) => {
    const profile = await fetchUserProfile(userId);
    if (profile) {
      setProfile(profile as ProfileWithRoles);
    }
  };

  useEffect(() => {
    if (user?.id) {
      callAndSetProfile(user.id);
    } else if (user === undefined) {
      setProfile(undefined);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, profile, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
