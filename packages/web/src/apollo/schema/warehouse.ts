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
  query GetWarehousesQuery(
    $location: WarehouseLocationTypeInput!
    $minPrice: Float
    $maxPrice: Float
    $warehouseVariant: WarehouseVariantType
  ) {
    getWarehouses(
      location: $location
      minPrice: $minPrice
      maxPrice: $maxPrice
      warehouseVariant: $warehouseVariant
    ) {
      _id
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

export const sendBookingMutation = gql`
  mutation Mutation($warehouseId: String!, $email: String!, $name: String!) {
    sendBooking(warehouseId: $warehouseId, email: $email, name: $name)
  }
`;

export const sendPriceBookingMutation = gql`
  mutation Mutation($plan: String!, $email: String!, $name: String!) {
    sendPriceBooking(plan: $plan, email: $email, name: $name)
  }
`;
