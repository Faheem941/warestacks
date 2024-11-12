'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import useApolloErrorHandler from '@/apollo/utilities/utilities';
import { sendContactUsMutation } from '@/apollo/schema/user';
import Button from './button';
import Input from './input';

interface ContactModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function ContactModal({ open, setOpen }: ContactModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const errorHandler = useApolloErrorHandler();
  const { enqueueSnackbar } = useSnackbar();

  const [sendContactUs, { loading: isLoading }] = useMutation<
    { sendPriceBooking: boolean },
    { name: string; email: string; message: string }
  >(sendContactUsMutation, {
    onError: errorHandler,
    onCompleted() {
      enqueueSnackbar('Your request was submitted successful', { variant: 'success' });
    },
    variables: {
      email,
      name,
      message,
    },
  });

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
              <p className="text-header-color font-semibold">Contact</p>
            </div>
            <div className="bg-white p-8 sm:flex">
              <div className="flex flex-col w-full">
                <h2 className="text-2xl text-header-color mb-5">
                  Please provide the following information
                </h2>
                <div className="space-y-5">
                  <Input
                    label="Email Address"
                    id="email"
                    placeholder="example@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e)}
                  />
                  <Input
                    label="Full Name"
                    id="name"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e)}
                  />
                  <Input
                    label="Your Message"
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e)}
                    isTextArea
                  />
                  <div className="flex justify-end gap-x-4">
                    <Button text="Cancel" type="outlined" onClick={() => setOpen(!open)} />
                    <Button
                      text="Submit"
                      isLoading={isLoading}
                      onClick={async () => {
                        if (!email.length || !name.length || !message.length) {
                          enqueueSnackbar('Please fill all the inputs', { variant: 'info' });
                          return;
                        }

                        await sendContactUs();
                        setEmail('');
                        setName('');
                        setMessage('');
                        setOpen(!open);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
