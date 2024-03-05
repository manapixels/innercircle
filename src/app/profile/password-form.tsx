'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updatePassword } from '../_lib/actions';

interface PasswordFormInput {
  password: string;
}

export default function PasswordForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInput>();
  const onSubmit: SubmitHandler<PasswordFormInput> = async (data) => {
    setLoading(true)
    await updatePassword(data.password);
    setLoading(false);
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
        type="password"
        id="password"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        placeholder="Password"
        {...register('password', {
          required: true,
        })}
        aria-invalid={errors.password ? 'true' : 'false'}
      />
      {errors.password?.type === 'required' && (
        <p role="alert">Please enter your password</p>
      )}

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
