import Image from 'next/image';

const EventListItemSkeleton = () => {
  return (
    <div
      role="status"
      className="animate-pulse relative flex gap-4 p-6 rounded-lg bg-white border"
    >
      <div className="relative aspect-square">
        <div className="bg-gray-200 rounded-lg w-40 h-40 flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="Inner Circle"
            width="95"
            height="95"
            className="grayscale opacity-20"
          />
        </div>
      </div>
      <div className="flex-1 space-y-4 flex flex-col justify-between w-full">
        <div className="w-full">
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[240px] mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2"></div>
        </div>
        <div className="w-full">
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[240px] mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default EventListItemSkeleton;
