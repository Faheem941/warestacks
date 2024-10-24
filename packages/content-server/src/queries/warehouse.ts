import { schemaComposer } from 'graphql-compose';
import { createResolver, warehouseLocationTypeComposer } from '../graphql';
import { WarehouseLocation, optimized } from '../mongoose';
import { normalizeNoSpace } from '../utilities/text';

/* ----------------------------------------- Resolvers ------------------------------------------ */
const locationListTypeComposer = schemaComposer.createObjectTC({
  name: 'locationList',
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
  type: locationListTypeComposer.getTypePlural(),
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
