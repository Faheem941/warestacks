import { gql } from '@apollo/client';

import { selfFragment, userFragment } from './fragment';

// Mutations
export const registerMutation = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      ...UserFields
      ...SelfFields
    }
  }
  ${userFragment}
  ${selfFragment}
`;

export const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ...UserFields
      ...SelfFields
    }
  }
  ${userFragment}
  ${selfFragment}
`;

export const logoutMutation = gql`
  mutation LogoutMutation {
    logout
  }
`;
