import { IWarehouseLocation, WarehouseVariant } from '@warestacks/common';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LocationSearch from '@/components/locationSearch';
import Button from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import Input from '@/components/ui/input';

export type WarehouseVariantFE = WarehouseVariant | 'na';

function FilterSection() {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState<IWarehouseLocation | undefined>(
    undefined,
  );

  const [minPrice, setMinPrice] = useState('50');
  const [maxPrice, setMaxPrice] = useState('1000');
  const [warehouseVariant, setWarehouseVariant] = useState<WarehouseVariantFE>('na');

  return (
    <div className="flex items-center md:gap-4 md:p-4 md:px-20 md:flex-row flex-col px-4 p-3 gap-3">
      <div className="md:w-[70rem] w-full">
        <LocationSearch
          setSelectedLocation={setSelectedLocation}
          selectedLocation={selectedLocation}
          variant="default"
        />
      </div>
      <Dropdown
        id="dropdown"
        options={{
          na: 'Select a Warehouse Type',
          standard: 'Standard',
          tempControlled: 'Temperature Controlled',
          secure: 'Secure',
        }}
        defaultValue="na"
        onChange={(value) => setWarehouseVariant(value as WarehouseVariantFE)}
      />
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
            `/listing?location=${selectedLocation?.city}, ${selectedLocation?.region}&minPrice=${dataMinPrice}&maxPrice=${dataMaxPrice}&warehouseVariant=${warehouseVariant === 'na' ? '' : warehouseVariant}`,
          );
        }}
      />
    </div>
  );
}

export default FilterSection;
