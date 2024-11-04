import { IWarehouseLocation } from '@dwms/common';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from '@/components/locationSearch';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

function FilterSection() {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState<IWarehouseLocation | undefined>(
    undefined,
  );

  const [minPrice, setMinPrice] = useState('50');
  const [maxPrice, setMaxPrice] = useState('1000');

  return (
    <div className="flex items-center gap-4 p-4 px-20">
      <div className="w-[70rem]">
        <LocationSearch
          setSelectedLocation={setSelectedLocation}
          selectedLocation={selectedLocation}
          variant="default"
        />
      </div>
      <Input id="size" label="Warehouse Size" placeholder="100 meter square" />
      <Input
        id="price"
        label="Min Price"
        placeholder="$50 per day"
        type="number"
        value={minPrice.toString()}
        onChange={(e) => setMinPrice(e)}
      />
      <Input
        id="price"
        label="Max Price"
        placeholder="$1000 per day"
        type="number"
        value={maxPrice.toString()}
        onChange={(e) => setMaxPrice(e)}
      />
      {/* <Button text="Filters" type="outlined" /> */}
      <Button
        text="Search"
        isDisabled={!selectedLocation}
        onClick={() => {
          const dataMinPrice = minPrice.length ? minPrice : '50';
          const dataMaxPrice = maxPrice.length ? maxPrice : '1000';
          router.replace(
            `/listing?location=${selectedLocation?.city}, ${selectedLocation?.region}&minPrice=${dataMinPrice}&maxPrice=${dataMaxPrice}`,
          );
        }}
      />
    </div>
  );
}

export default FilterSection;
