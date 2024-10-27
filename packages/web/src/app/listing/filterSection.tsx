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

  return (
    <div className="flex items-center gap-4 p-4 px-10">
      <div className="w-[70rem]">
        <LocationSearch
          setSelectedLocation={setSelectedLocation}
          selectedLocation={selectedLocation}
          variant="default"
        />
      </div>
      <Input id="size" label="Warehouse Size" placeholder="100 meter square" />
      <Input id="price" label="Price" placeholder="$100 per day" />
      <Button text="Filters" type="outlined" />
      <Button
        text="Search"
        isDisabled={!selectedLocation}
        onClick={() =>
          router.replace(`/listing?location=${selectedLocation?.city}, ${selectedLocation?.region}`)
        }
      />
    </div>
  );
}

export default FilterSection;
