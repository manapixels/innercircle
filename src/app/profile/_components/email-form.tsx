'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateEmail } from '../../_lib/actions';
import Spinner from '../../_components/Spinner';

interface EmailFormInput {
  email: string;
}

export default function EmailForm({ currEmail }: { currEmail: string | undefined }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currEmail) {
      reset({ email: currEmail });
    }
  }, [currEmail]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormInput>({
    defaultValues: { email: currEmail ?? '' },
  });
  const onSubmit: SubmitHandler<EmailFormInput> = async (data: EmailFormInput) => {
    setLoading(true);
    await updateEmail(data.email);
    setLoading(false);
  };

  return (
    <form className="p-10 border border-gray-300 rounded-lg bg-gray-50" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-xs mb-0.5"><span className="text-gray-400">Current:</span> {currEmail}</div>
      <input
        type="email"
        id="email"
        className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${loading ? 'animate-pulse bg-gray-200' : ''}`}
        disabled={loading}
        required
        placeholder="New email"
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          validate: (value) => value !== currEmail,
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
      <div className="mb-2"></div>
      <div className="text-right">
        <button
          type="submit"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-md text-xs px-2 py-1.5"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-1.5" />}
          Change email
        </button>
      </div>
    </form>
  );
}
