'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { User } from '@supabase/supabase-js';
import { createClient } from '../_utils/supabase/client';

const supabase = createClient();
const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.log('[UserContext] Failed to fetch user', error);
      if (data?.user) setUser(data.user as User);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);
        if (session?.user) setUser(session?.user);
      },
    );

    getUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={user || null}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
