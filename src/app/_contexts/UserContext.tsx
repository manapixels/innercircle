'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';

import { createClient } from '../_utils/supabase/client';
import { ProfileWithRoles, fetchUserProfile } from '../_lib/actions';

const supabase = createClient();
const UserContext = createContext<ProfileWithRoles | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ProfileWithRoles>();
  const listenerRegistered = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError)
          throw new Error(
            `[UserContext] Failed to fetch user: ${authError.message}`,
          );
        if (authData?.user) {
          const profile = await fetchUserProfile(authData.user.id);
          if (profile) {
            setUser(profile as ProfileWithRoles);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!listenerRegistered.current) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Auth event: ${event}`);
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setUser(profile as ProfileWithRoles);
            }
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

  return (
    <UserContext.Provider value={user || null}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
