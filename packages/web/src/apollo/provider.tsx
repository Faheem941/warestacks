// app/providers.tsx

'use client';

import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import ContextProvider from '@/context/contextProvider';
import apolloClient from './client';

function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider>
        <ContextProvider>{children}</ContextProvider>
      </SnackbarProvider>
    </ApolloProvider>
  );
}

export default ApolloWrapper;
