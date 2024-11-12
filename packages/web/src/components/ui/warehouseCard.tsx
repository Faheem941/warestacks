'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { sendBookingMutation } from '@/apollo/schema/warehouse';
import useApolloErrorHandler from '@/apollo/utilities/utilities';
import Button from './button';
import Input from './input';

interface WarehouseCardProps {
  _id: string;
  name: string;
  distance?: number;
  price: number;
  rating: number;
  reviews: number;
  badges: string[];
  imageSrc: string;
  ownedBy: string;
  isHighRated?: boolean;
}

function WarehouseCard({
  _id,
  name,
  distance = undefined,
  price,
  rating,
  reviews,
  badges,
  imageSrc,
  ownedBy,
  isHighRated = false,
}: WarehouseCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex p-4 md:flex-row flex-col border bg-white rounded-3xl shadow-sm transition-all duration-300 hover:border-green-700 hover:shadow-lg md:w-[70vw] md:max-w-6xl w-full">
        <Image
          src={imageSrc}
          alt={name}
          className="md:w-96 w-full h-64 object-cover rounded-xl mr-4"
          width={1100}
          height={1100}
        />
        <div className="flex flex-col mt-4 md:mt-0">
          <h2 className="md:text-2xl text-lg font-semibold text-slate-700 text-clip">{name}</h2>
          {distance && (
            <p className="text-neutral-500 mt-2 md:text-base text-sm">
              {distance} Km from logistics
            </p>
          )}
          <p className="text-neutral-500 md:text-base text-sm">
            Flexible terms - Includes handling
          </p>
          <p className="text-slate-800 md:mt-8 mt-4 font-semibold md:text-base text-sm">Owned By</p>
          <p className="text-neutral-500 md:text-base text-sm">{ownedBy}</p>
          <div className="flex items-center gap-3 md:mt-auto mt-2">
            {badges.map((badge) => (
              <span
                key={Math.random()}
                className="bg-white text-sm py-2 px-4 border border-gray-300 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="flex md:flex-col flex-row md:items-end justify-start gap-4 md:ml-auto">
          <div className="flex items-center gap-x-3">
            <div className="flex flex-col items-center">
              {isHighRated && (
                <p className="text-black font-semibold md:text-base text-sm">Highly Rated</p>
              )}
              <button
                type="button"
                className="text-green-700 md:text-sm text-xs underline underline-offset-2"
              >
                {reviews} Reviews
              </button>
            </div>
            <div className="bg-green-600 text-white rounded-full md:p-4 p-2 flex items-center justify-center md:text-xl font-bold">
              {rating}
            </div>
          </div>

          <div className="flex flex-col md:mt-auto mt-4 md:gap-0 gap-2 ml-auto md:ml-0">
            <div className="text-end">
              <p className="md:text-2xl text-lg font-bold text-slate-700">${price} per day</p>
              <p className="text-gray-500 md:text-sm text-xs">Flexible booking options</p>
            </div>

            <Button text="Book Now" variant="lg" onClick={() => setOpen(!open)} />
          </div>
        </div>
      </div>
      <ModalDialog
        open={open}
        setOpen={setOpen}
        warehouseTitle={name}
        ownedBy={ownedBy}
        _id={_id}
      />
    </>
  );
}

function ModalDialog({
  _id,
  open,
  setOpen,
  warehouseTitle,
  ownedBy,
}: {
  _id: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  warehouseTitle: string;
  ownedBy: string;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const errorHandler = useApolloErrorHandler();
  const { enqueueSnackbar } = useSnackbar();

  const [sendBooking, { loading: isLoading }] = useMutation<
    { sendBooking: boolean },
    { name: string; email: string; warehouseId: string }
  >(sendBookingMutation, {
    onError: errorHandler,
    onCompleted() {
      enqueueSnackbar('Your request was submitted successful', { variant: 'success' });
    },
    variables: {
      email,
      name,
      warehouseId: _id,
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
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-full max-w-4xl"
          >
            <div className="bg-white bg-opacity-80 flex flex-row items-center justify-center py-2">
              <p className="text-header-color font-semibold">Request Warehouse</p>
            </div>
            <div className="bg-white md:p-8 p-4 sm:flex">
              {/* Left Section for Description */}
              <div className="flex-1 border-r border-gray-200 pr-8 content-center text-center">
                <h2 className="md:text-2xl text-lg font-bold text-gray-900">{warehouseTitle}</h2>
                <p className="mt-2 text-gray-500">{ownedBy}</p>
              </div>

              {/* Right Section for Form */}
              <div className="flex-1 md:pl-8 md:mt-0 mt-4">
                <div className="space-y-6">
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
                  <div className="flex justify-end gap-x-4">
                    <Button text="Cancel" type="outlined" onClick={() => setOpen(!open)} />
                    <Button
                      text="Submit"
                      isLoading={isLoading}
                      onClick={async () => {
                        if (!email.length || !name.length) {
                          enqueueSnackbar('Please fill all the inputs', { variant: 'info' });
                          return;
                        }

                        await sendBooking();
                        setEmail('');
                        setName('');
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

export default WarehouseCard;
