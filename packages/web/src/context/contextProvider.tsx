import React from 'react';

import { useQuery } from '@apollo/client';
import { ISelf } from '@warestacks/common/model';

import { selfQuery } from '@/apollo/schema/user';
import AppContext from './context';

interface IProps {
  children: React.ReactNode;
}

export default function ContextProvider({ children }: IProps) {
  // Logged-in user
  const { data: userData, loading: isSelfLoading } = useQuery<{ self: ISelf }, {}>(selfQuery);
  const self = userData?.self;

  // Context value
  const contextValue = React.useMemo(
    () => ({
      self,
      isSelfLoading,
    }),
    [self, isSelfLoading],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
