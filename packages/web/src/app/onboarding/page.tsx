'use client';

import React, { useContext, useEffect } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Navbar from '@/components/ui/navigation';
import AppContext from '@/context/context';
import CircularProgress from '@/components/ui/circularProgress';

function Page() {
  const { self, isSelfLoading } = useContext(AppContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!self && !isSelfLoading) {
      window.location.href = '/auth';
    }
  }, [isSelfLoading, self]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[90vh] bg-violet-50 bg-opacity-40">
        {isSelfLoading ? (
          <CircularProgress />
        ) : (
          <div className="w-full max-w-3xl flex flex-col items-center">
            <h1 className="text-7xl font-bold text-slate-700 text-center mb-4">
              Tell Us About <span className="text-violet-600">Yourself</span>
            </h1>
            <div className="max-w-xl">
              <p className="text-center text-neutral-500 mb-6">
                We need a few details to set up your buyer account. This information will help us
                tailor the best warehouses for your needs.
              </p>
              <div onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input id="name" label="Name" placeholder="John Wick" />
                  <Input id="phone" label="Phone" placeholder="+44239809900" />
                  <Input id="company" label="Company" placeholder="Perabellum" />
                  <Input id="role" label="Role" placeholder="CEO" />
                </div>

                <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value=""
                    className="w-7 rounded-lg h-7 accent-violet-600 text-violet-600 bg-white border-gray-300 focus:ring-violet-500 focus:ring-2 "
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="ms-2 text-base font-medium text-neutral-600 dark:text-gray-300"
                  >
                    I agree with the{' '}
                    <a href="/terms" className="text-violet-600 hover:underline">
                      terms and conditions
                    </a>
                    .
                  </label>
                </div>
                <div className="flex flex-row justify-center">
                  <Button
                    text="Complete"
                    onClick={() => {
                      window.location.href = '/';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
