'use client';

import { IWarehouseWithRegion } from '@warestacks/common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/button';
import LocationSearch from '@/components/locationSearch';

function Hero() {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState<IWarehouseWithRegion | undefined>();

  return (
    <div id="hero" className="w-full h-[70vh] items-start z-10 bg-green-100 relative">
      <div className="z-0">
        <Image
          loading="eager"
          src="/hero.png"
          className="w-full h-[70vh] absolute top-0 object-cover"
          width={800}
          height={1100}
          alt=""
        />
      </div>
      <div className="bg-primary absolute top-0 z-10 w-full h-full opacity-40" />
      <div className="flex flex-col items-center p-4 pt-10 md:p-20 justify-between z-20">
        <div className="flex flex-col z-30 justify-center items-center mt-10">
          <h1 className="text-2xl md:text-5xl relative font-semibold text-white font-sans tracking-tight md:text-start text-center">
            Global <span className="text-secondary">Warehouse Management</span> Simplified
          </h1>
          <p className="w-auto md:w-[35rem] text-white text-center mt-5">
            Efficiently manage your warehouse, reduce costs, and maximize space utilization across a
            global network.
          </p>
          <div className="w-auto md:w-[40rem] bg-white h-fit shadow-lg p-4 mt-10 rounded-2xl flex flex-row gap-x-4">
            <div className="md:w-[40rem]">
              <LocationSearch
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            </div>
            <Button
              text="Search"
              variant="lg"
              isDisabled={!selectedLocation}
              onClick={() =>
                router.push(
                  `/listing?location=${selectedLocation?.city}, ${selectedLocation?.region}&minPrice=50&maxPrice=1000`,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
