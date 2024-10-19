import { gql } from '@apollo/client';
import { selfFragment, userFragment } from './fragment';

export const userQuery = gql`
  query UserQuery($username: String!) {
    user(username: $username) {
      ...UserFields
    }
  }
  ${userFragment}
`;

export const selfQuery = gql`
  {
    self {
      ...UserFields
      ...SelfFields
    }
  }
  ${userFragment}
  ${selfFragment}
`;
