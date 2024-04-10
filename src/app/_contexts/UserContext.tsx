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

const supabase = createClient();
const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const listenerRegistered = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error)
          throw new Error(
            `[UserContext] Failed to fetch user: ${error.message}`,
          );
        if (data?.user) setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    if (!listenerRegistered.current) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log(`Auth event: ${event}`);
          if (session?.user) setUser(session.user);
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
