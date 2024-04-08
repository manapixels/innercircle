'use client';

import { FileUpload } from '@/app/_components/FileUpload';
import {
  getTimeZonesWithOffset,
  getGuessedUserTimeZone,
} from '@/app/_utils/date';
import GooglePlacesAutocomplete from 'react-google-autocomplete';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  name: string;
  category: string;
  location_name: string;
  location_address: string;
  location_country: string;
  date: string;
  time_start: string;
  time_end: string;
  all_day: boolean;
  time_zone: string;
  description: string;
  price: number;
  price_currency: string;
  slots: number;
};

export default function CreateEventForm() {
  const timeZones = getTimeZonesWithOffset();
  const guessedTimeZone = getGuessedUserTimeZone();

  const handlePlaceSelected = (place) => {
    console.log(place);
    setValue('location_name', place.name);
    setValue('location_address', place.formatted_address);
    const filtered_array = place.address_components.filter(
      function (address_component) {
        return address_component.types.includes('country');
      },
    );
    const country = filtered_array.length ? filtered_array[0].long_name : '';
    setValue('location_country', country);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <FileUpload className="sm:col-span-2" />
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <input
            {...register('name', {
              required: 'Please enter the name of the event.',
            })}
            type="text"
            name="name"
            id="name"
            className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="location_country"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            {...register('category', {
              required: 'Please select the category of the event.',
            })}
            name="category"
            id="category"
            defaultValue="Singapore"
            className={`mt-1 block w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          >
            <option>Speed Dating</option>
          </select>
          {errors.category && (
            <span className="text-red-500">
              {errors.category.message}
            </span>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="autocomplete"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>

        <div className="relative">
          {/* Fields available: https://developers.google.com/maps/documentation/javascript/place-data-fields */}
          <GooglePlacesAutocomplete
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-8 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={handlePlaceSelected}
            options={{
              types: ['establishment'],
              fields: [
                'name',
                'formatted_address',
                'address_components',
                'url',
                'website'
              ],
              componentRestrictions: { country: 'SG' },
            }}
          />
          <div className="absolute top-0 left-0 p-2">
            <svg width="20px" height="20px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#434a59"><path d="M17 17L21 21" stroke="#434a59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="#434a59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </div>
        </div>
        </div>
        <div>
          <label
            htmlFor="location_name"
            className="block text-sm font-medium text-gray-700"
          >
            Location Name
          </label>
          <input
            {...register('location_name', {
              required: 'Please enter the name of the location.',
            })}
            type="text"
            name="location_name"
            id="location_name"
            required
            className={`mt-1 block w-full border ${errors.location_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          />
          {errors.location_name && (
            <span className="text-red-500">{errors.location_name.message}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="location_address"
            className="block text-sm font-medium text-gray-700"
          >
            Location Address
          </label>
          <input
            {...register('location_address', {
              required: 'Please enter the address of the location.',
            })}
            type="text"
            name="location_address"
            id="location_address"
            required
            className={`mt-1 block w-full border ${errors.location_address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          />
          {errors.location_address && (
            <span className="text-red-500">
              {errors.location_address.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="location_country"
            className="block text-sm font-medium text-gray-700"
          >
            Location Country
          </label>
          <select
            {...register('location_country', {
              required: 'Please select the country of the location.',
            })}
            name="location_country"
            id="location_country"
            defaultValue="Singapore"
            className={`mt-1 block w-full border ${errors.location_country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          >
            <option>Singapore</option>
          </select>
          {errors.location_country && (
            <span className="text-red-500">
              {errors.location_country.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            {...register('date', {
              required: 'Please select the date of the event.',
            })}
            type="date"
            name="date"
            id="date"
            required
            className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          />
          {errors.date && (
            <span className="text-red-500">{errors.date.message}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="time_start"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              {...register('time_start', {
                required: 'Please enter the start time of the event.',
              })}
              type="time"
              name="time_start"
              id="time_start"
              required
              className={`mt-1 block w-full border ${errors.time_start ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.time_start && (
              <span className="text-red-500">{errors.time_start.message}</span>
            )}
          </div>
          <div>
            <label
              htmlFor="time_end"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              {...register('time_end', {
                required: 'Please enter the end time of the event.',
              })}
              type="time"
              name="time_end"
              id="time_end"
              required
              className={`mt-1 block w-full border ${errors.time_end ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
            />
            {errors.time_end && (
              <span className="text-red-500">{errors.time_end.message}</span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="all_day"
            id="all_day"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-gray-50"
          />
          <label
            htmlFor="all_day"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            All day
          </label>
        </div>
        <div>
          <label
            htmlFor="time_zone"
            className="block text-sm font-medium text-gray-700"
          >
            Time zone
          </label>
          <select
            {...register('time_zone', {
              required: 'Please select the time zone of the event.',
            })}
            name="time_zone"
            id="time_zone"
            defaultValue={guessedTimeZone}
            required
            className={`mt-1 block w-full border ${errors.time_zone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          >
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          {errors.time_zone && (
            <span className="text-red-500">{errors.time_zone.message}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register('description', {
              required: 'Please enter a description for the event.',
            })}
            name="description"
            id="description"
            rows={3}
            className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          ></textarea>
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <label
            htmlFor="price"
            className="col-span-2 block text-sm font-medium text-gray-700"
          >
            Price (Currency)
          </label>
          <input
            {...register('price', {
              required: 'Please enter the price of the event.',
            })}
            type="number"
            name="price"
            id="price"
            required
            className="col-span-2 mt-1 block w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
          />
          {errors.price && (
            <span className="text-red-500">{errors.price.message}</span>
          )}
          <select
            {...register('price_currency', {
              required: 'Please select the currency of the price.',
            })}
            name="price_currency"
            id="price_currency"
            defaultValue="SGD"
            className={`mt-1 block w-full border ${errors.price_currency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          >
            <option>SGD</option>
          </select>
          {errors.price_currency && (
            <span className="text-red-500">
              {errors.price_currency.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="slots"
            className="block text-sm font-medium text-gray-700"
          >
            Slots Available
          </label>
          <input
            {...register('slots', {
              required: 'Please enter the number of slots available.',
            })}
            type="number"
            name="slots"
            id="slots"
            required
            className={`mt-1 block w-full border ${errors.slots ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50`}
          />
          {errors.slots && (
            <span className="text-red-500">{errors.slots.message}</span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        </div>
      </div>
    </form>
  );
}
