'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation';
import WarehouseCard from '@/components/ui/warehouseCard';
import FilterSection from './filterSection';

const warehouses = [
  {
    name: 'Warehouse Plus',
    distance: '0.4 km from logistic hub',
    price: 180,
    rating: 9.4,
    reviews: 500,
    badges: ['Badge 1', 'Badge 2'],
    imageSrc: '/hero.png',
    ownedBy: 'Secure storage solution',
    feature: 'Spacious storage area',
  },
  {
    name: 'Warehouse Plus',
    distance: '0.4 km from logistic hub',
    price: 180,
    rating: 9.4,
    reviews: 500,
    badges: ['Badge 1', 'Badge 2'],
    imageSrc: '/hero.png',
    ownedBy: 'Secure storage solution',
    feature: 'Spacious storage area',
  },
  {
    name: 'Warehouse Plus',
    distance: '0.4 km from logistic hub',
    price: 180,
    rating: 9.4,
    reviews: 500,
    badges: ['Badge 1', 'Badge 2'],
    imageSrc: '/hero.png',
    feature: 'Spacious storage area',
    ownedBy: 'Secure storage solution',
  },
  {
    name: 'Warehouse Plus',
    distance: '0.4 km from logistic hub',
    price: 180,
    rating: 9.4,
    reviews: 500,
    badges: ['Badge 1', 'Badge 2'],
    imageSrc: '/hero.png',
    feature: 'Spacious storage area',
    ownedBy: 'Secure storage solution',
  },
  {
    name: 'Warehouse Plus',
    distance: '0.4 km from logistic hub',
    price: 180,
    rating: 9.4,
    reviews: 500,
    badges: ['Badge 1', 'Badge 2'],
    imageSrc: '/hero.png',
    feature: 'Spacious storage area',
    ownedBy: 'Secure storage solution',
  },
];

function WarehousePage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');

  return (
    <>
      <Navbar isFixed={false} />
      <div className="bg-[#F7F6F5] min-h-screen h-auto relative">
        {/* Sticky Filter Section */}
        <div className="border-b border-neutral-200 bg-white sticky z-40 top-0">
          <div className="px-8 py-1 mx-auto max-w-7xl">
            <FilterSection />
          </div>
        </div>

        {/* Scrollable Warehouse Cards */}
        <div className="flex flex-col gap-6 pt-8 pb-20 items-center mx-auto">
          {warehouses.map((warehouse) => (
            <WarehouseCard
              key={Math.random()}
              badges={warehouse.badges}
              distance={warehouse.distance}
              feature={warehouse.feature}
              imageSrc={warehouse.imageSrc}
              name={warehouse.name}
              ownedBy={warehouse.ownedBy}
              price={warehouse.price}
              rating={warehouse.rating}
              reviews={warehouse.reviews}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default WarehousePage;
