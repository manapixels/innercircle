'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserType, fetchUserProfile, updateUserProfile } from '../_lib/actions';

interface AuthFormInput {
  email: string;
  birthyear: number;
  birthmonth: number;
  name: string;
}

export default function ProfileForm({ userId }: { userId: string | undefined }) {
  const [loading, setLoading] = useState(true);
  const [currProfile, setCurrProfile] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await fetchUserProfile(userId);
        setCurrProfile(profile as UserType);
        reset(profile as UserType)
      } catch (error) {
        alert('Error loading user data!');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  async function updateProfile(user: UserType) {
    try {
      setLoading(true);
      updateUserProfile(user);
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormInput>({
    defaultValues: useMemo(() => {
      return currProfile ?? undefined;
    }, [currProfile])
  });
  const onSubmit: SubmitHandler<AuthFormInput> = async (data) => {
    await updateProfile({ ...currProfile, ...data } as UserType);
  };

  return (
    <form className="max-w-lg mx-auto p-10" onSubmit={handleSubmit(onSubmit)}>

      {loading && (
        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        type="email"
        id="email"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        placeholder="Email"
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        aria-invalid={errors.email ? 'true' : 'false'}
      />
      {errors.email?.type === 'required' && (
        <p role="alert">Please enter your email</p>
      )}
      {errors.email?.type === 'pattern' && (
        <p role="alert">Please enter a valid email</p>
      )}

      <input
        type="text"
        id="name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        placeholder="Name"
        {...register('name', {
          required: true,
        })}
        aria-invalid={errors.name ? 'true' : 'false'}
      />
      {errors.name?.type === 'required' && (
        <p role="alert">Please enter your name</p>
      )}
      {errors.name?.type === 'pattern' && (
        <p role="alert">Please enter a valid name</p>
      )}

      <div className="mb-5 w-full flex">
        <select
          {...register('birthyear', {
            required: true,
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          {Array.from(
            { length: new Date().getFullYear() - 1970 - 20 + 1 },
            (_, i) => 1970 + i,
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.birthyear?.type === 'required' && (
          <p role="alert">Please enter your birthyear</p>
        )}
        <select
          {...register('birthmonth', {
            required: true,
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option value="Jan">Jan</option>
          <option value="Feb">Feb</option>
          <option value="Mar">Mar</option>
          <option value="Apr">Apr</option>
          <option value="May">May</option>
          <option value="Jun">Jun</option>
          <option value="Jul">Jul</option>
          <option value="Aug">Aug</option>
          <option value="Sep">Sep</option>
          <option value="Oct">Oct</option>
          <option value="Nov">Nov</option>
          <option value="Dec">Dec</option>
        </select>
        {errors.birthmonth?.type === 'required' && (
          <p role="alert">Please enter your birthmonth</p>
        )}
      </div>

      <button
        type="submit"
        className="button primary block"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Loading ...' : 'Update'}
      </button>
    </form>
  );
}
