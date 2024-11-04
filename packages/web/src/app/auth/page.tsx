'use client';

import { useMutation } from '@apollo/client';
import { ISelf } from '@dwms/common';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { loginMutation, registerMutation } from '@/apollo/schema/authentication';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import useApolloErrorHandler from '@/apollo/utilities/utilities';
import { createSelfUpdater } from '@/apollo/utilities';
import AppContext from '@/context/context';
import CircularProgress from '@/components/ui/circularProgress';
import apolloClient from '@/apollo/client';

interface IAuthFields {
  email: string;
  password: string;
}

function Page() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { self, isSelfLoading } = useContext(AppContext);

  const errorHandler = useApolloErrorHandler();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [register, { loading: isRegisterLoading }] = useMutation<
    { registerUser?: ISelf },
    IAuthFields
  >(registerMutation, {
    onError: errorHandler,
    update: createSelfUpdater('registerUser'),
    onCompleted({ registerUser: newSelf }) {
      if (!newSelf) {
        enqueueSnackbar('An error occured while creating account', { variant: 'error' });
        return;
      }

      if (!newSelf.isOnboardingComplete) {
        router.push('/onboarding');
        return;
      }

      router.push('/');
    },
    variables: {
      email,
      password,
    },
  });

  const [login, { loading: isLoginLoading }] = useMutation<{ login?: ISelf }, IAuthFields>(
    loginMutation,
    {
      onError: errorHandler,
      update: createSelfUpdater('registerUser'),
      onCompleted({ login: selfUser }) {
        if (!selfUser) {
          enqueueSnackbar('An error occured while logging into account', { variant: 'error' });
          return;
        }

        apolloClient.reFetchObservableQueries();

        if (!selfUser.isOnboardingComplete) {
          router.push('/onboarding');
          return;
        }

        router.push('/');
      },
      variables: {
        email,
        password,
      },
    },
  );

  useEffect(() => {
    if (self && !isSelfLoading && self.isOnboardingComplete) {
      router.replace('/');
    }
  }, [isSelfLoading, router, self]);

  const handleAuth = async () => {
    if (!email.length || !password.length || (isSignUp && !confirmPassword.length)) {
      enqueueSnackbar('Please provide all fields', { variant: 'error' });
      return;
    }

    if (isSignUp) {
      await register();
      return;
    }

    await login();
  };

  if (isSelfLoading || self) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-600">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-600">
      <div className="bg-white p-8 rounded-[2rem] shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-bold text-green-700 text-center mb-4">DWMS</h2>
        <p className="text-center text-neutral-600 mb-6">
          <span className="text-slate-800 text-lg font-semibold">Welcome</span> <br /> Login to DWMS
          to continue using it
        </p>
        <div className="space-y-4">
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="some@example.com"
            onChange={(value) => setEmail(value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="******"
            onChange={(value) => setPassword(value)}
          />

          {/* Animated Confirm Password field */}
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="******"
                  onChange={(value) => setConfirmPassword(value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isSignUp && (
            <div className="flex justify-between items-center">
              <button type="button" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            text={isSignUp ? 'Sign up' : 'Login'}
            width="w-full"
            onClick={() => handleAuth()}
            isLoading={isRegisterLoading || isLoginLoading}
          />
        </div>

        <div className="mt-6">
          <p className="text-center text-gray-600">
            {isSignUp ? `Already` : `Don't`} have an account?{' '}
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex items-center py-3 px-6 border border-gray-300 rounded-2xl shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50"
          >
            <Image
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="h-5 w-5"
              width={50}
              height={50}
            />
            <p className="mx-auto">Continue with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
