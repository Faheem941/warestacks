'use client';

import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery';
import { IWarehouseLocation } from '@dwms/common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { getLocationsQuery } from '@/apollo/schema/warehouse';

function Hero() {
  const router = useRouter();
  const [isShowResult, setIsShowResult] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<
    Omit<IWarehouseLocation, 'distanceFromLogisticHub' | 'warehouses'> | undefined
  >();
  const [getLocations, { data: locationsData, loading: isLoading }] = useLazyQuery<
    { getLocations: Array<Omit<IWarehouseLocation, 'distanceFromLogisticHub' | 'warehouses'>> },
    { searchText?: string }
  >(getLocationsQuery);

  const debouncedCallback = useDebouncedCallback((value: string) => {
    setSelectedLocation(undefined);
    setIsShowResult(true);
    getLocations({ variables: { searchText: value } });
  }, 1000);

  return (
    <div id="hero" className="w-full h-[70vh] items-start z-10 bg-violet-100 relative">
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
      <div className="bg-violet-200 absolute top-0 z-10 w-full h-full opacity-70" />
      <div className="flex flex-col items-center p-4 pt-10 md:p-20 justify-between z-20">
        <div className="flex flex-col z-30 justify-center items-center mt-10">
          <h1 className="text-2xl md:text-5xl relative font-semibold text-slate-700 dark:text-white font-sans tracking-tight md:text-start text-center">
            Global <span className="text-violet-800">Warehouse Management</span> Simplified
          </h1>
          <p className="w-auto md:w-[35rem] text-black text-center mt-5">
            Efficiently manage your warehouse, reduce costs, and maximize space utilization across a
            global network.
          </p>
          <div className="w-auto md:w-[40rem] bg-white h-fit shadow-lg p-4 mt-10 rounded-2xl flex flex-row gap-x-4 relative">
            <Input
              value={searchText}
              variant="large"
              id="location"
              label="Enter a location"
              placeholder="e.g London, Greater London"
              onChange={(e) => {
                const { value } = e.target;
                setSearchText(value);

                debouncedCallback(value);
              }}
              isLoading={isLoading}
            />
            <Button
              text="Search"
              variant="lg"
              onClick={() => router.push(`/listing?location=${searchText}`)}
            />
            <div
              className={`absolute top-[7rem] left-4 bg-white  shadow-xl ${locationsData?.getLocations.length && isShowResult && !selectedLocation ? 'h-fit md:w-[30rem] z-10' : 'h-0 w-0 -z-10'} border border-gray-300 rounded-xl flex flex-col`}
            >
              {isShowResult &&
                !selectedLocation &&
                locationsData?.getLocations.map((location) => (
                  <p
                    key={location.city + location.region}
                    role="presentation"
                    className="text-neutral-600 font-medium px-5 py-2 cursor-pointer hover:bg-neutral-100 first:rounded-t-xl last:rounded-b-xl border border-transparent"
                    onClick={() => {
                      setSelectedLocation(location);
                      setSearchText(`${location.city}, ${location.region}`);
                    }}
                  >
                    {location.city}, {location.region}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
