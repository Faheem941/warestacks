/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const getLocationsQuery = gql`
  query GetLocationsQuery($searchText: String) {
    getLocations(searchText: $searchText) {
      city
      region
    }
  }
`;
