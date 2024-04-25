import { User } from '@supabase/supabase-js';
import { EventWithSignUps } from "./event";
import { Tables } from '@/types/definitions';

export type UserWithProfile = User & Tables<'profiles'>;
export type Profile = Tables<'profiles'> & { email?: string };
export type ProfileWithRoles = Tables<'profiles_with_roles'>;
export type ProfileWithEventsHosted = Tables<'profiles_with_hosted_events'> & {
    hosted_events: EventWithSignUps[];
};