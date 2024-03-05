'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updatePassword } from '../../_lib/actions';
import Spinner from '../../_components/Spinner';

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
    setLoading(true);
    await updatePassword(data.password);
    setLoading(false);
  };

  return (
    <form className="p-10 border border-gray-300 rounded-lg bg-gray-50" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        id="password"
        className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${loading ? 'animate-pulse bg-gray-200' : ''}`}
        required
        disabled={loading}
        placeholder="New password"
        {...register('password', {
          required: true,
        })}
        aria-invalid={errors.password ? 'true' : 'false'}
      />
      {errors.password?.type === 'required' && (
        <p role="alert">Please enter your password</p>
      )}
      <div className="mb-2"></div>
      <div className="text-right">
        <button
          type="submit"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-md text-xs px-2 py-1.5"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-1.5" />}
          Change password
        </button>
      </div>
    </form>
  );
}
