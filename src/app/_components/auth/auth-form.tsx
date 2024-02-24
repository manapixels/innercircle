'use client';
import { signInWithEmail, signUpNewUser } from '@/app/_lib/data';
import { useState } from 'react';
import { GrFormView, GrFormViewHide } from 'react-icons/gr';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Modal } from '../Modal';

interface AuthFormInput {
  email: string;
  password: string;
}

export default function AuthForm() {
  const [state, setState] = useState('login'); // ['login', 'register']
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormInput>();
  const onSubmit: SubmitHandler<AuthFormInput> = (data) => {
    console.log(data);
    // signInWithEmail(data.email, data.password)
    // signUpNewUser(data.email, data.password)
  };

  const toggleModal = () => setShowModal(!showModal);

  const btn = (
    <button
      type="button"
      onClick={toggleModal}
      className="text-white bg-black hover:bg-gray-900 focus:ring-4 focus:ring-base-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-base-600 dark:hover:bg-base-700 focus:outline-none dark:focus:ring-base-800"
    >
      Log in <span aria-hidden="true">&rarr;</span>
    </button>
  );

  return (
    <div>
      {btn}

      <Modal
        isOpen={showModal}
        handleClose={toggleModal}
        backdropDismiss={true}
      >
            {/* Modal header */}
            <div className="flex items-center justify-between px-12 py-6 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome to <i>innercircle</i>
              </h3>
              
            </div>

            <form
              className="max-w-lg mx-auto p-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-5 w-full">
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
              </div>
              <div className="mb-5 w-full">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    placeholder="Password"
                    {...register('password', { required: true })}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <GrFormView
                      onClick={() => setShowPassword(!showPassword)}
                      className={`h-6 text-gray-700 ${showPassword ? 'hidden' : 'block'}`}
                      size="30"
                    />
                    <GrFormViewHide
                      onClick={() => setShowPassword(!showPassword)}
                      className={`h-6 text-gray-700 ${showPassword ? 'block' : 'hidden'}`}
                      size="30"
                    />
                    {errors.password?.type === 'required' && (
                      <p role="alert">Please enter your password</p>
                    )}
                  </div>
                </div>
              </div>
              {state === 'login' && (
                <div className="flex justify-between mb-5">
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <label
                      htmlFor="remember"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Keep me logged in
                    </label>
                  </div>
                  <a
                    className="text-sm text-gray-400 font-medium text-foreground ml-4"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
              <button
                type="submit"
                className="text-black bg-base-100 hover:bg-base-200 focus:ring-4 focus:outline-none focus:ring-base-300 font-bold rounded-lg text-sm block w-full px-5 py-2.5 text-center dark:bg-base-600 dark:hover:bg-base-700 dark:focus:ring-base-800"
              >
                {state === 'login' ? 'Log in' : 'Sign up'}
              </button>

              {state === 'login' && (
                <div className="text-sm text-gray-500 text-center mt-4">
                  No account yet?{' '}
                  <button
                    onClick={() => setState('register')}
                    className="text-gray-900"
                  >
                    Sign up
                  </button>
                </div>
              )}
              {state === 'register' && (
                <div className="text-xs text-gray-500 text-center mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => setState('login')}
                    className="text-gray-900"
                  >
                    Log in
                  </button>
                </div>
              )}
            </form>
      </Modal>
    </div>
  );
}
