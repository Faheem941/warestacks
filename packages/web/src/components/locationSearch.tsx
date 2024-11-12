import { IWarehouseWithRegion } from '@warestacks/common';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'next/navigation';
import { getLocationsQuery } from '@/apollo/schema/warehouse';
import Input from './ui/input';

interface LocaitonSearchProps {
  selectedLocation?: IWarehouseWithRegion;
  setSelectedLocation: (value: IWarehouseWithRegion | undefined) => void;
  variant?: 'default' | 'large';
}

function LocationSearch({
  selectedLocation = undefined,
  setSelectedLocation,
  variant = 'large',
}: LocaitonSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [isShowResult, setIsShowResult] = useState(false);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const queryLocation = searchParams.get('location');
  const queryLocationData: IWarehouseWithRegion | undefined = useMemo(() => {
    if (!queryLocation) {
      return undefined;
    }
    const temp = queryLocation.split(', ');
    return {
      city: temp[0],
      region: temp[1],
    };
  }, [queryLocation]);

  useEffect(() => {
    if (!queryLocationData) {
      return;
    }

    setSelectedLocation(queryLocationData);
    setSearchText(`${queryLocationData.city}, ${queryLocationData.region}`);
  }, [queryLocationData, setSelectedLocation]);

  const [getLocations, { data: locationsData }] = useLazyQuery<
    { getLocations: Array<IWarehouseWithRegion> },
    { searchText?: string }
  >(getLocationsQuery);

  const debouncedCallback = useDebouncedCallback((value: string) => {
    setIsShowResult(true);
    getLocations({ variables: { searchText: value } }).then(() => {
      setIsLoading(false);
    });
  }, 1000);

  return (
    <div className="relative">
      <Input
        value={searchText}
        variant={variant}
        id="location"
        label="Enter a location"
        placeholder="e.g London, Greater London"
        onChange={(value) => {
          setSearchText(value);
          setIsShowResult(false);
          setSelectedLocation(undefined);
          if (!value.length) {
            return;
          }
          setIsLoading(true);
          debouncedCallback(value);
        }}
        isLoading={isLoading}
      />
      <div
        className={`absolute ${variant === 'default' ? 'top-20' : 'top-24'} left-0 bg-white  shadow-xl ${locationsData?.getLocations.length && isShowResult && !selectedLocation ? 'h-fit w-full z-[1000]' : 'h-0 w-0 -z-10'} border border-gray-300 rounded-xl flex flex-col`}
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
  );
}

export default function LocationSearchSuspense({
  selectedLocation = undefined,
  setSelectedLocation,
  variant = 'large',
}: LocaitonSearchProps) {
  return (
    <Suspense>
      <LocationSearch
        setSelectedLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
        variant={variant}
      />
    </Suspense>
  );
}
