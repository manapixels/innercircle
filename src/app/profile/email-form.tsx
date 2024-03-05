'use client';
import { useMemo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateEmail } from '../_lib/actions';

interface EmailFormInput {
  email: string;
}

export default function EmailForm({ _email }: { _email: string | undefined }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormInput>({
    defaultValues: useMemo(() => {
      return { email: _email ?? '' };
    }, [_email])
  });
  const onSubmit: SubmitHandler<EmailFormInput> = async (data) => {
    setLoading(true)
    await updateEmail(data.email);
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
        type="email"
        id="email"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        placeholder="Email"
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          validate: value => value !== _email,
        })}
        aria-invalid={errors.email ? 'true' : 'false'}
      />
      {errors.email?.type === 'required' && (
        <p role="alert">Please enter your email</p>
      )}
      {errors.email?.type === 'pattern' && (
        <p role="alert">Please enter a valid email</p>
      )}
      {errors.email?.type === 'validate' && (
        <p role="alert">Email must be different from the current email</p>
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
