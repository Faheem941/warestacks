import { gql } from '@apollo/client';
import { warehouseProviderFragment } from './fragment';

export const getLocationsQuery = gql`
  query GetLocationsQuery($searchText: String) {
    getLocations(searchText: $searchText) {
      city
      region
    }
  }
`;

export const getWarehousesQuery = gql`
  query GetWarehousesQuery($location: WarehouseLocationTypeInput!) {
    getWarehouses(location: $location) {
      badges
      description
      pricePerDay
      rating
      reviewsCount
      title
      distanceFromLogisticHub
      providerId
      locationId
      provider {
        ...WarehouseProviderFields
      }
    }
  }
  ${warehouseProviderFragment}
`;
