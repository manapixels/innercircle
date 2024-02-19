import Image from 'next/image';;
import { Event } from '@/app/lib/definitions-backup';
export default async function Events({
    events,
}: {
    events: Event[];
}) {
    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className="mb-4 text-xl md:text-2xl">
                Latest Events
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

                <div className="bg-white px-6">
                    {events.map((event, i) => {
                        return (
                            <div
                                key={event.id}
                                className={`flex flex-row items-center justify-between py-4 ${i !== 0 ?? 'border-t'}`}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={event.image_url}
                                        alt={`${event.name}'s profile picture`}
                                        className="mr-4 rounded-full"
                                        width={32}
                                        height={32}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {event.name}
                                        </p>
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {event.description}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {event.date_start} {event.date_end}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {event.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div> */}
            </div>
        </div>
    );
}