import { Metadata } from 'next';
import { ProfileWithEventsHosted, fetchProfileWithHostedEvents } from '@/app/_lib/actions';

export const metadata: Metadata = {
    title: 'innercircle | Profile',
};

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const profile = (await fetchProfileWithHostedEvents(params.id)) as ProfileWithEventsHosted;
    return (
        <div className="flex w-full flex-col md:col-span-4">
            {JSON.stringify(profile)}
        </div>
    );
}
