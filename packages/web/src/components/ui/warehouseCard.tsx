import Image from 'next/image';
import React from 'react';
import Button from './button';

interface WarehouseCardProps {
  name: string;
  distance: string;
  price: number;
  rating: number;
  reviews: number;
  badges: string[];
  imageSrc: string;
  ownedBy: string;
  feature: string;
}

function WarehouseCard({
  name,
  distance,
  price,
  rating,
  reviews,
  badges,
  imageSrc,
  ownedBy,
  feature,
}: WarehouseCardProps) {
  return (
    <div className="flex p-4 border bg-white rounded-3xl shadow-sm transition-all duration-300 hover:border-violet-700 hover:shadow-lg w-[70vw] max-w-6xl">
      <Image
        src={imageSrc}
        alt={name}
        className="w-96 h-64 object-cover rounded-xl mr-4"
        width={1100}
        height={1100}
      />
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold text-slate-700">{name}</h2>
        <p className="text-neutral-500 mt-2">{distance}</p>
        <p className="text-neutral-500">Flexible terms - Includes handling</p>
        <p className="text-slate-800 mt-8">{feature}</p>
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
            <p className="text-black font-semibold">Highly Rated</p>
            <button type="button" className="text-violet-700 text-sm underline underline-offset-2">
              {reviews} Reviews
            </button>
          </div>
          <div className="bg-violet-600 text-white rounded-full p-4 flex items-center justify-center text-xl font-bold">
            {rating}
          </div>
        </div>

        <div className="text-end mt-auto">
          <p className="text-2xl font-bold text-slate-700">${price} per day</p>
          <p className="text-gray-500 text-sm">Flexible booking options</p>
        </div>

        <Button text="Book Now" variant="lg" />
      </div>
    </div>
  );
}

export default WarehouseCard;
