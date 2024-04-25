import { Tables } from "@/types/definitions";

export type Event = Tables<'events'>;
export type EventWithSignUps = Tables<'events_with_host_data'>;
export type EventWithCreatorInfo = EventWithSignUps & {
    created_by: Tables<'profiles'> & {
        events_created?: number;
        guests_hosted?: number;
    };
};
