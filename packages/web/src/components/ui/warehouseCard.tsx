'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';
import Button from './button';
import Input from './input';

interface WarehouseCardProps {
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
      <div className="flex p-4 border bg-white rounded-3xl shadow-sm transition-all duration-300 hover:border-green-700 hover:shadow-lg w-[70vw] max-w-6xl">
        <Image
          src={imageSrc}
          alt={name}
          className="w-96 h-64 object-cover rounded-xl mr-4"
          width={1100}
          height={1100}
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-slate-700 text-clip">{name}</h2>
          {distance && <p className="text-neutral-500 mt-2">{distance} Km from logistics</p>}
          <p className="text-neutral-500">Flexible terms - Includes handling</p>
          <p className="text-slate-800 mt-8 font-semibold">Owned By</p>
          <p className="text-neutral-500">{ownedBy}</p>
          <div className="flex items-center gap-3 mt-auto">
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
        <div className="flex flex-col items-end justify-start gap-4 ml-auto">
          <div className="flex items-center gap-x-3">
            <div className="flex flex-col items-center">
              {isHighRated && <p className="text-black font-semibold">Highly Rated</p>}
              <button type="button" className="text-green-700 text-sm underline underline-offset-2">
                {reviews} Reviews
              </button>
            </div>
            <div className="bg-green-600 text-white rounded-full p-4 flex items-center justify-center text-xl font-bold">
              {rating}
            </div>
          </div>

          <div className="text-end mt-auto">
            <p className="text-2xl font-bold text-slate-700">${price} per day</p>
            <p className="text-gray-500 text-sm">Flexible booking options</p>
          </div>

          <Button text="Book Now" variant="lg" onClick={() => setOpen(!open)} />
        </div>
      </div>
      <ModalDialog open={open} setOpen={setOpen} name={name} ownedBy={ownedBy} />
    </>
  );
}

function ModalDialog({
  open,
  setOpen,
  name,
  ownedBy,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  name: string;
  ownedBy: string;
}) {
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
            <div className="bg-white p-8 sm:flex">
              {/* Left Section for Description */}
              <div className="flex-1 border-r border-gray-200 pr-8 content-center text-center">
                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                <p className="mt-2 text-gray-500">{ownedBy}</p>
              </div>

              {/* Right Section for Form */}
              <div className="flex-1 pl-8">
                <div className="space-y-6">
                  <Input label="Email Address" id="email" placeholder="example@example.com" />
                  <Input label="Full Name" id="name" placeholder="John Smith" />
                  <div className="flex justify-end gap-x-4">
                    <Button text="Cancel" type="outlined" onClick={() => setOpen(!open)} />
                    <Button text="Submit" />
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
