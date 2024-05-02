import { Tables } from "@/types/definitions";

export type Event = Tables<'events'>;
export type EventWithParticipants = Event & {
    participants: (Tables<'profiles'> & {
        tickets_bought: number;
    })[];
    sign_ups: number;
};
export type EventWithSignUps = Tables<'events_with_host_data'>;
export type EventWithCreatorInfo = EventWithSignUps & {
    created_by: Tables<'profiles'> & {
        events_created?: number;
        guests_hosted?: number;
    };
};
export type EventReservation = Tables<'event_reservations'>;
export type EventWithReservations = Event & {
    created_by: Tables<'profiles'>;
    reservations: EventReservation[];
};

