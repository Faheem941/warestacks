// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context'; // Helper for cookie management
import { RetryLink } from '@apollo/client/link/retry';
import { contentServerHostname } from '@/utilities/environment';

// Http link
const httpLink = new HttpLink({
  uri: `https://${contentServerHostname}/api`,
  credentials: 'include',
});

const beforewareLink = setContext((_: any, previousContext) => {
  const newHeaders = { ...previousContext.headers };

  const token = localStorage.getItem('CSRF-Token');
  if (token) {
    newHeaders['CSRF-Token'] = token;
  }

  return { ...previousContext, headers: newHeaders };
});

// Afterware to handle CSRF token updates from responses
const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      const token = headers.get('CSRF-Token');

      if (token) {
        localStorage.setItem('CSRF-Token', token);
      }
    }

    return response;
  }),
);

const errorLink = onError(({ networkError, operation, forward }) => {
  if (
    networkError &&
    'result' in networkError &&
    typeof networkError.result === 'object' &&
    networkError.result?.error === 'Invalid CSRF token'
  ) {
    const context = operation.getContext();
    const token = context.response.headers.get('CSRF-Token');

    if (token) {
      localStorage.setItem('CSRF-Token', token);

      operation.setContext({
        headers: {
          ...context.headers,
          'CSRF-Token': localStorage.getItem('CSRF-Token'),
        },
      });

      return forward(operation);
    }
  }

  return undefined;
});

// Apollo Client with middleware
const apolloClient = new ApolloClient({
  link: ApolloLink.from([beforewareLink, afterwareLink, new RetryLink(), errorLink, httpLink]),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
});

export default apolloClient;
