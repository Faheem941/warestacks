import { gql } from '@apollo/client';

// User fragments
export const userFragment = gql`
  fragment UserFields on UserInterface {
    createdAt
    email
    fullName
  }
`;

export const selfFragment = gql`
  fragment SelfFields on Self {
    _id
    role
    phone
    interests
    company
    isOnboardingComplete
  }
`;
