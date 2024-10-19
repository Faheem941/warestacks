import React from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

function FilterSection() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Input id="location" label="Enter a location" placeholder="Bradford, Yorkshire" />
      <Input id="size" label="Warehouse Size" placeholder="100 meter square" />
      <Input id="price" label="Price" placeholder="$100 per day" />
      <Button text="Filters" type="outlined" />
    </div>
  );
}

export default FilterSection;
