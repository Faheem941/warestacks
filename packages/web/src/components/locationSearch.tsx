import { IWarehouseWithRegion } from '@dwms/common';
import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDebouncedCallback } from 'use-debounce';
import { getLocationsQuery } from '@/apollo/schema/warehouse';
import Input from './ui/input';

interface LocaitonSearchProps {
  selectedLocation?: IWarehouseWithRegion;
  setSelectedLocation: (value: IWarehouseWithRegion | undefined) => void;
}

function LocationSearch({
  selectedLocation = undefined,
  setSelectedLocation,
}: LocaitonSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [isShowResult, setIsShowResult] = useState(false);

  const [getLocations, { data: locationsData, loading: isLoading }] = useLazyQuery<
    { getLocations: Array<IWarehouseWithRegion> },
    { searchText?: string }
  >(getLocationsQuery);

  const debouncedCallback = useDebouncedCallback((value: string) => {
    setIsShowResult(true);
    getLocations({ variables: { searchText: value } });
  }, 1000);

  return (
    <div className="relative">
      <Input
        value={searchText}
        variant="large"
        id="location"
        label="Enter a location"
        placeholder="e.g London, Greater London"
        onChange={(e) => {
          const { value } = e.target;
          setSearchText(value);
          setSelectedLocation(undefined);
          debouncedCallback(value);
        }}
        isLoading={isLoading}
      />
      <div
        className={`absolute top-[6rem] left-0 bg-white  shadow-xl ${locationsData?.getLocations.length && isShowResult && !selectedLocation ? 'h-fit md:w-[30rem] z-10' : 'h-0 w-0 -z-10'} border border-gray-300 rounded-xl flex flex-col`}
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

export default LocationSearch;
