import { User } from '@supabase/supabase-js';
import { EventWithSignUps, Event } from "./event";
import { Tables } from '@/types/definitions';

export type UserWithProfile = User & Tables<'profiles'>;
export type Profile = Tables<'profiles'> & { email?: string };
export type ProfileWithRoles = Tables<'profiles_with_roles'>;
export type ProfileWithEvents = Tables<'profiles_with_events_hosted'> & {
    events_hosted: EventWithSignUps[];
    events_joined: Event[];
};

