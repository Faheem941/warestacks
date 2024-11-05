import { IWarehouseWithRegion } from '@warestacks/common';
import { schemaComposer, toInputType } from 'graphql-compose';
import {
  createResolver,
  getSubfieldProjection,
  warehouseLocationTypeComposer,
  warehouseProviderTypeComposer,
  warehouseTypeComposer,
} from '../graphql';
import { IMongooseWarehouse, IMongooseWarehouseProvider } from '../model';
import { Warehouse, WarehouseLocation, optimized } from '../mongoose';
import { normalizeNoSpace } from '../utilities/text';

/* ----------------------------------------- Resolvers ------------------------------------------ */
const locationTypeComposer = schemaComposer.createObjectTC({
  name: 'WarehouseLocationType',
  fields: {
    city: 'String',
    region: 'String,',
  },
});

warehouseLocationTypeComposer.addResolver({
  name: 'getLocations',
  args: {
    searchText: 'String',
  },
  type: locationTypeComposer.getTypePlural(),
  resolve: createResolver(
    'get all locations based on search',
    async ({ args }, resolve) => {
      const { searchText }: { searchText?: string } = args;

      if (!searchText || !searchText.length) {
        resolve([]);
        return;
      }

      const normalizedSearchText = normalizeNoSpace(searchText);

      const locations = await optimized(
        WarehouseLocation.find({
          $or: [
            {
              city: { $regex: normalizedSearchText, $options: 'i' },
            },
            {
              region: { $regex: normalizedSearchText, $options: 'i' },
            },
          ],
        }).limit(5),
        ['city', 'region'],
      );

      resolve(locations);
    },
    { isAuthenticated: false },
  ),
});

warehouseTypeComposer.addResolver({
  name: 'getWarehouses',
  args: {
    location: { type: toInputType(locationTypeComposer).getTypeNonNull() },
    minPrice: 'Float',
    maxPrice: 'Float',
  },
  type: warehouseTypeComposer.getTypePlural(),
  resolve: createResolver(
    'get all warehouses based on a location',
    async ({ args, projection, info }, resolve) => {
      const {
        location,
        minPrice = 50,
        maxPrice = 1000,
      }: { location: IWarehouseWithRegion; minPrice: number; maxPrice: number } = args;

      const providerProjections = getSubfieldProjection<
        IMongooseWarehouse,
        IMongooseWarehouseProvider
      >(info, warehouseTypeComposer, 'provider', warehouseProviderTypeComposer);

      const locationResult = await optimized(
        WarehouseLocation.findOne({
          $or: [{ city: location.city }, { region: location.region }],
        }),
        '_id',
      );

      if (!locationResult) {
        resolve([]);
        return;
      }

      const warehouses = optimized(
        Warehouse.find({
          locationId: locationResult._id,
          $and: [
            {
              pricePerDay: { $gte: minPrice },
            },
            {
              pricePerDay: { $lte: maxPrice },
            },
          ],
        }).populate([
          {
            path: 'provider',
            model: 'WarehouseProvider',
            select: providerProjections,
            options: { lean: true },
          },
        ]),
        projection,
      );

      resolve(warehouses);
    },
    { isAuthenticated: false },
  ),
});
