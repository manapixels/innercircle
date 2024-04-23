'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useForm,
  SubmitHandler,
  Controller,
  SubmitErrorHandler,
} from 'react-hook-form';
import GooglePlacesAutocomplete from 'react-google-autocomplete';

import Spinner from '@/_components/ui/Spinner';
import { FileUpload } from '@/_components/ui/FileUpload';
import { useToast } from '@/_components/ui/use-toast';
import { useUser } from '@/_contexts/UserContext';
import { Event, EventWithSignUps, updateEvent } from '@/_lib/actions';
import {
  getGuessedUserTimeZone,
  getTimeZonesWithOffset,
} from '@/_lib/_utils/date';

type Inputs = {
  name: string;
  category: string[];
  location_name: string;
  location_address: string;
  location_country: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  time_zone: string;
  description: string;
  image_thumbnail_url: string;
  image_banner_url: string;
  price: number;
  price_currency: string;
  slots: number;
};

const formatDatePart = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

const formatTimePart = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const detectTimeZone = (date) => {
  const timeZone = new Date(date)
    .toLocaleTimeString('en-us', { timeZoneName: 'longOffset' })
    .split(' ')[2];
  return timeZone;
};

export default function EditEventForm({
  event,
  onSuccess,
  closeModal,
}: {
  event: EventWithSignUps;
  onSuccess: (event: EventWithSignUps) => void;
  closeModal: () => void;
}) {
  const { toast } = useToast();
  const autocompleteRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const timeZones = getTimeZonesWithOffset();
  const guessedTimeZone = getGuessedUserTimeZone();
  const { profile } = useUser();

  const handlePlaceSelected = (place) => {
    setValue('location_name', place.name);
    setValue('location_address', place.formatted_address);
    const filtered_array = place.address_components.filter(
      function (address_component) {
        return address_component.types.includes('country');
      },
    );
    const country = filtered_array.length ? filtered_array[0].long_name : '';
    setValue('location_country', country);

    if (autocompleteRef.current) {
      (autocompleteRef.current as any).value = ''; // Clear the input
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: event?.name || '',
      category: event?.category || [],
      location_name: event?.location_name || '',
      location_address: event?.location_address || '',
      location_country: event?.location_country || '',
      date_start: formatDatePart(event.date_start) || '',
      time_start: formatTimePart(event.date_start) || '',
      date_end: formatDatePart(event.date_end) || '',
      time_end: formatTimePart(event.date_end) || '',
      time_zone: detectTimeZone(event.date_start) || '',
      description: event?.description || '',
      image_thumbnail_url: event?.image_thumbnail_url || '',
      image_banner_url: event?.image_banner_url || '',
      price: event?.price || 0,
      price_currency: event?.price_currency?.toUpperCase() || '',
      slots: event?.slots || 0,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setShowErrorSummary(false);

    console.log(data);
    // Convert GMT+08:00 to +08:00 format for valid Date parsing
    const timeZoneOffset = data.time_zone.replace('GMT', '');
    const date_start = new Date(
      `${data.date_start}T${data.time_start}${timeZoneOffset}`,
    );
    const date_end = new Date(
      `${data.date_end}T${data.time_end}${timeZoneOffset}`,
    );

    if (
      event?.id &&
      profile?.id &&
      data.image_banner_url &&
      data.image_thumbnail_url &&
      data.price &&
      data.description
    ) {
      setIsLoading(true);
      const result = await updateEvent({
        id: event.id,
        name: data.name,
        description: data.description,
        category: data.category as Event['category'],
        created_by: profile?.id,
        date_start: date_start.toISOString(),
        date_end: date_end.toISOString(),
        location_name: data.location_name,
        location_address: data.location_address,
        location_country: data.location_country,
        price: data.price,
        slots: data.slots,
        price_currency:
          data.price_currency.toLowerCase() as Event['price_currency'],
        image_thumbnail_url: data.image_thumbnail_url,
        image_banner_url: data.image_banner_url,
      });

      if (result) {
        toast({
          description: 'Event has been updated successfully.',
          className: 'bg-green-700 text-white border-transparent',
        });
        onSuccess({
          ...result,
          sign_ups: event?.sign_ups,
        } as EventWithSignUps);
        setTimeout(() => {
          setIsLoading(false);
          closeModal();
        }, 500);
      } else {
        setIsLoading(false);
      }
    } else {
      toast({
        description:
          "Sorry for the bug. Some params are missing and the event can't be created.",
        className: 'bg-red-700 text-white border-transparent',
      });
    }
  };

  const onError: SubmitErrorHandler<Inputs> = (_errors) => {
    if (Object.keys(_errors).length > 0) {
      setShowErrorSummary(true); // Show the error summary

      const firstErrorField = Object.keys(_errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      );

      if (errorElement instanceof HTMLElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };

  // Watch fields
  const watchStartDate = watch('date_start');
  const watchEndDate = watch('date_end');
  const watchCategory = watch('category');

  const handleThumbnailUpload = (uploadResult: string) => {
    setValue('image_thumbnail_url', uploadResult, { shouldValidate: true });
  };

  const handleBannerUpload = (uploadResult: string) => {
    setValue('image_banner_url', uploadResult, { shouldValidate: true });
  };

  useEffect(() => {
    if (new Date(watchEndDate) < new Date(watchStartDate)) {
      setValue('date_end', watchStartDate);
    }
  }, [watchStartDate, setValue]);

  useEffect(() => {
    if (new Date(watchEndDate) < new Date(watchStartDate)) {
      setValue('date_start', watchEndDate);
    }
  }, [watchEndDate, setValue]);

  return (
    <div>
      <div className="text-xl font-medium mb-5 py-1">Edit event</div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
          {/* Event thumbnail */}
          <div className="sm:col-span-2">
            <FileUpload
              className="aspect-square h-full"
              currValue={event?.image_thumbnail_url}
              userId={profile?.id}
              bucketId="event_thumbnails"
              label="Thumbnail"
              onUploadComplete={handleThumbnailUpload}
              register={register}
              validationSchema={{
                required: 'Upload thumbnail.',
              }}
              name="image_thumbnail_url"
            />
            {errors.image_thumbnail_url && (
              <span className="text-red-500 text-sm">
                {errors.image_thumbnail_url.message}
              </span>
            )}
          </div>
          {/* Event banner */}
          <div className="sm:col-span-4">
            <FileUpload
              className="h-full"
              currValue={event?.image_banner_url}
              userId={profile?.id}
              bucketId="event_banners"
              label="Banner"
              onUploadComplete={handleBannerUpload}
              register={register}
              validationSchema={{
                required: 'Upload banner.',
              }}
              name="image_banner_url"
            />
            {errors.image_banner_url && (
              <span className="text-red-500 text-sm">
                {errors.image_banner_url.message}
              </span>
            )}
          </div>
          {/* Event name */}
          <div className="sm:col-span-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name <span className="text-red-500 text-sm">*</span>
            </label>
            <input
              {...register('name', {
                required: 'Enter name of event.',
              })}
              type="text"
              name="name"
              id="name"
              className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          {/* Event category */}
          <div className="sm:col-span-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category <span className="text-red-500 text-sm">*</span>
            </label>
            <Controller
              control={control}
              name="category"
              rules={{ required: 'Select at least one category.' }}
              render={({ field }) => (
                <div className="flex items-center gap-2 mt-1">
                  {['speed-dating', 'retreats'].map((category) => (
                    <label
                      key={category}
                      className={`${field.value.includes(category) ? 'border-gray-900 text-gray-800 shadow-[0_0_0_1px_rgba(0,0,0,1)]' : ''} font-medium text-gray-500 hover:text-gray-800 border border-gray-400 hover:border-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        value={category}
                        className="sr-only"
                        checked={field.value.includes(category)}
                        onChange={() => {
                          const newValue = field.value.includes(category)
                            ? field.value.filter((v) => v !== category)
                            : [...field.value, category];
                          field.onChange(newValue);
                        }}
                      />
                      {category
                        .split('-')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </label>
                  ))}
                </div>
              )}
            />
            {/* <select
              {...register('category', {
                required: 'Select category of event.',
              })}
              name="category"
              id="category"
              defaultValue="Singapore"
              className={`mt-1 block w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            >
              <option>Speed Dating</option>
            </select> */}
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Event description */}
          <div className="sm:col-span-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500 text-sm">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Enter description for the event.',
              })}
              name="description"
              id="description"
              rows={3}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>
          {/* Event location */}
          <div className="sm:col-span-6">
            <label
              htmlFor="autocomplete"
              className="block text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-500 text-sm">*</span>
            </label>

            <div className="flex flex-row gap-4">
              <div className="relative flex-grow">
                {/* Fields available: https://developers.google.com/maps/documentation/javascript/place-data-fields */}
                <GooglePlacesAutocomplete
                  ref={autocompleteRef}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-9 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={handlePlaceSelected}
                  options={{
                    types: ['establishment'],
                    fields: [
                      'name',
                      'formatted_address',
                      'address_components',
                      'url',
                      'website',
                    ],
                    componentRestrictions: { country: 'SG' },
                  }}
                />
                <div className="absolute top-0 left-0 p-2 mt-1">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#434a59"
                  >
                    <path
                      d="M17 17L21 21"
                      stroke="#434a59"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
                      stroke="#434a59"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <select
                  {...register('location_country', {
                    required: 'Select country of location.',
                  })}
                  name="location_country"
                  id="location_country"
                  defaultValue="Singapore"
                  disabled={true}
                  className={`mt-1 block w-full border ${errors.location_country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 pointer-events-none`}
                >
                  <option>Singapore</option>
                </select>
                {errors.location_country && (
                  <span className="text-red-500 text-sm">
                    {errors.location_country.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Event location name */}
          <div className="-mt-3 sm:col-span-6">
            <input
              {...register('location_name', {
                required: 'Enter name of location.',
              })}
              type="text"
              name="location_name"
              id="location_name"
              placeholder="Location name"
              required
              className={`mt-1 block w-full border ${errors.location_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.location_name && (
              <span className="text-red-500 text-sm">
                {errors.location_name.message}
              </span>
            )}
          </div>
          {/* Event address */}
          <div className="-mt-3 sm:col-span-6">
            <input
              {...register('location_address', {
                required: 'Enter address of location.',
              })}
              type="text"
              name="location_address"
              id="location_address"
              placeholder="Address"
              required
              className={`mt-1 block w-full border ${errors.location_address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.location_address && (
              <span className="text-red-500 text-sm">
                {errors.location_address.message}
              </span>
            )}
          </div>
          {/* Event date and time */}
          <div className="sm:col-span-6">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Date <span className="text-red-500 text-sm">*</span>
              </label>
              <select
                {...register('time_zone', {
                  required: 'Select time zone of event.',
                })}
                name="time_zone"
                id="time_zone"
                defaultValue={guessedTimeZone}
                required
                className={`block border ${errors.time_zone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs bg-gray-50`}
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-4">
              <input
                {...register('date_start', {
                  required: 'Select date of event.',
                })}
                type="date"
                name="date_start"
                id="date_start"
                required
                className={`mt-1 block w-full border ${errors.date_start ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
              />

              <input
                {...register('time_start', {
                  required: 'Enter start time of event.',
                })}
                type="time"
                name="time_start"
                id="time_start"
                required
                className={`mt-1 block w-full border ${errors.time_start ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
              />
              <div className="text-center self-center">–</div>

              <input
                {...register('time_end', {
                  required: 'Enter end time of event.',
                })}
                type="time"
                name="time_end"
                id="time_end"
                required
                className={`mt-1 block w-full border ${errors.time_end ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
              />

              <input
                {...register('date_end', {
                  required: 'Select end date of event.',
                  validate: (value) =>
                    new Date(value) >= new Date(watchStartDate) ||
                    'End date must be after start date.',
                })}
                type="date"
                name="date_end"
                id="date_end"
                required
                className={`mt-1 block w-full border ${errors.date_end ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
              />
            </div>
            <div>
              {errors.date_start && (
                <span className="text-red-500 text-sm">
                  {errors.date_start.message}
                </span>
              )}
              {errors.time_start && (
                <span className="text-red-500 text-sm">
                  {errors.time_start.message}
                </span>
              )}
              {errors.time_end && (
                <span className="text-red-500 text-sm">
                  {errors.time_end.message}
                </span>
              )}
              {errors.date_end && (
                <span className="text-red-500 text-sm">
                  {errors.date_end.message}
                </span>
              )}
            </div>
          </div>
          {/* Event price and currency */}
          <div className="sm:col-span-3">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price <span className="text-red-500 text-sm">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <input
                  {...register('price', {
                    required: 'Enter price of event.',
                  })}
                  type="number"
                  name="price"
                  id="price"
                  required
                  className="mt-1 block w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                />
              </div>
              <div>
                <select
                  {...register('price_currency', {
                    required: 'Select currency of price.',
                  })}
                  name="price_currency"
                  id="price_currency"
                  defaultValue="SGD"
                  className={`mt-1 block w-full border ${errors.price_currency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
                >
                  <option>SGD</option>
                </select>
                {errors.price_currency && (
                  <span className="text-red-500 text-sm">
                    {errors.price_currency.message}
                  </span>
                )}
              </div>
            </div>
            {errors.price && (
              <span className="text-red-500 text-sm">
                {errors.price.message}
              </span>
            )}
          </div>
          {/* Event slots */}
          <div className="sm:col-span-3">
            <label
              htmlFor="slots"
              className="block text-sm font-medium text-gray-700"
            >
              Slots Available <span className="text-red-500 text-sm">*</span>
            </label>
            <input
              {...register('slots', {
                required: 'Enter number of slots available.',
              })}
              type="number"
              name="slots"
              id="slots"
              required
              className={`mt-1 block w-full border ${errors.slots ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.slots && (
              <span className="text-red-500 text-sm">
                {errors.slots.message}
              </span>
            )}
          </div>
        </div>
        <div className="bg-white bg-opacity-75 border-t border-gray-400 sticky -mx-5 bottom-0 left-0 w-auto z-20">
          <div className="py-4 px-10 flex justify-between items-end">
            <div>
              {showErrorSummary && Object.keys(errors).length > 0 && (
                <div
                  className="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
                  role="alert"
                >
                  <strong>Please correct the following errors:</strong>
                  <ul>
                    {Object.keys(errors).map((errorField, index) => (
                      <li key={index}>{errors[errorField].message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-base-600 text-white px-12 py-3 rounded-full"
            >
              {isLoading && <Spinner className="mr-1.5" />}
              Update Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
