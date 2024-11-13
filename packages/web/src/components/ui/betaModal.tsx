'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useEffect, useState } from 'react';
import Button from './button';

const signupLink =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfZSIp2JdXzMdJvJyUSe0n_txh9WE2nH7uEQpYdRFYN8wJ1ig/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link&pli=1';

export default function BetaModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 500);
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="absolute z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-full max-w-xl"
          >
            <div className="bg-white bg-opacity-80 flex flex-row items-center justify-center py-2">
              <p className="text-header-color font-semibold">Join our Beta List</p>
            </div>
            <div className="bg-white p-8 sm:flex">
              {/* Left Section for Description */}
              <div className="text-center flex flex-col items-center justify-center">
                <h2 className="text-xl text-header-color mb-8">
                  Be part of our exclusive beta list to enjoy early benefits
                </h2>
                <div className="flex flex-row gap-x-4">
                  <Button text="Close" type="outlined" onClick={() => setOpen(false)} />
                  <Button
                    text="Join Now"
                    onClick={() => {
                      window.open(signupLink, '_blank');
                      setOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
