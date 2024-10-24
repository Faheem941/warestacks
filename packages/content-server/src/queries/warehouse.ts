import { IWarehouseLocation } from '@dwms/common';
import { schemaComposer, toInputType } from 'graphql-compose';
import {
  createResolver,
  getSubfieldProjection,
  warehouseLocationTypeComposer,
  warehouseProviderTypeComposer,
  warehouseTypeComposer,
} from '../graphql';
import { WarehouseLocation, optimized } from '../mongoose';
import { normalizeNoSpace } from '../utilities/text';
import { IMongooseWarehouse, IMongooseWarehouseProvider } from '../model';

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
  },
  type: warehouseTypeComposer.getTypePlural(),
  resolve: createResolver(
    'get all warehouses based on a location',
    async ({ args, projection, info }, resolve) => {
      const {
        location,
      }: { location: Omit<IWarehouseLocation, 'warehouses' | 'distanceFromLogisticHub'> } = args;

      const providerProjections = getSubfieldProjection<
        IMongooseWarehouse,
        IMongooseWarehouseProvider
      >(info, warehouseTypeComposer, 'provider', warehouseProviderTypeComposer);

      const result = await optimized(
        WarehouseLocation.findOne({
          $or: [{ city: location.city }, { region: location.region }],
        }).populate([
          {
            path: 'warehouses',
            model: 'Warehouse',
            select: projection,
            options: { lean: true },
            populate: {
              path: 'provider',
              model: 'WarehouseProvider',
              select: providerProjections,
              options: { lean: true },
            },
          },
        ]),
        ['warehouses'],
      );

      resolve(result?.warehouses);
    },
    { isAuthenticated: false },
  ),
});
