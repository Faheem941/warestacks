'use client';

import { useLazyQuery } from '@apollo/client';
import { IWarehouse, IWarehouseWithRegion, WithRequired } from '@warestacks/common';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { getWarehousesQuery } from '@/apollo/schema/warehouse';
import CircularProgress from '@/components/ui/circularProgress';
import Navbar from '@/components/ui/navigation';
import WarehouseCard from '@/components/ui/warehouseCard';
import FilterSection from './filterSection';

function WarehousePage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const warehouseVariant = searchParams.get('warehouseVariant');
  const locationData: IWarehouseWithRegion | undefined = useMemo(() => {
    if (!location) {
      return undefined;
    }
    const temp = location.split(', ');
    return {
      city: temp[0],
      region: temp[1],
    };
  }, [location]);

  const [getWarehouses, { data: warehouseData, loading: isLoading }] = useLazyQuery<
    { getWarehouses: Array<WithRequired<IWarehouse, 'provider'>> },
    { location: IWarehouseWithRegion; minPrice?: number; maxPrice?: number }
  >(getWarehousesQuery);

  const fetchWarehouses = useCallback(() => {
    if (locationData && !isLoading) {
      getWarehouses({
        variables: {
          location: {
            city: locationData.city,
            region: locationData.region,
          },
          ...(minPrice ? { minPrice: parseFloat(minPrice) } : []),
          ...(maxPrice ? { maxPrice: parseFloat(maxPrice) } : []),
          ...(warehouseVariant && warehouseVariant.length ? { warehouseVariant } : []),
        },
      });
    }
  }, [locationData, isLoading, getWarehouses, minPrice, maxPrice, warehouseVariant]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const warehouses = warehouseData?.getWarehouses;

  return (
    <>
      <Navbar isFixed={false} />
      <div className="bg-[#F7F6F5] min-h-screen h-auto relative">
        {/* Sticky Filter Section */}
        <div className="border-b border-neutral-200 bg-white md:sticky z-40 top-0">
          <div className="md:px-8 py-1 md:mx-auto max-w-7xl">
            <FilterSection />
          </div>
        </div>

        {/* Scrollable Warehouse Cards */}
        {isLoading || !warehouseData ? (
          <div className="flex flex-col items-center h-80 justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-8 pb-20 items-center mx-auto md:px-0 px-2">
            {!warehouses || !warehouses.length ? (
              <h2>Unable to find any warehouse at this location or price</h2>
            ) : (
              warehouses.map((warehouse) => (
                <WarehouseCard
                  key={warehouse._id}
                  _id={warehouse._id}
                  badges={warehouse.badges}
                  distance={warehouse.distanceFromLogisticHub}
                  imageSrc="/hero.png"
                  name={warehouse.title}
                  ownedBy={warehouse.provider.name}
                  price={warehouse.pricePerDay}
                  rating={warehouse.rating}
                  reviews={warehouse.reviewsCount}
                  isHighRated={warehouse.rating > 4}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default WarehousePage;
