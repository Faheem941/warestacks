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

export const sendContactUsMutation = gql`
  mutation Mutation($message: String!, $email: String!, $name: String!) {
    sendContactUs(message: $message, email: $email, name: $name)
  }
`;
