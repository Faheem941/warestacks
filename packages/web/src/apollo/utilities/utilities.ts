import { useSnackbar } from 'notistack';

import { ApolloError } from '@apollo/client';

function useApolloErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();

  return (error: ApolloError) => {
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((graphQLError) => {
        enqueueSnackbar(graphQLError.message, { variant: 'error' });
      });
    }

    if (error.networkError) {
      if (error.message === 'Failed to fetch') {
        enqueueSnackbar(
          'There was a problem trying to communicate with the server. Check your internet connection and try again.',
          { variant: 'error' },
        );
        return;
      }

      enqueueSnackbar(
        'Oops, an unknown error just happened. Please refresh the page or try again later.',
        { variant: 'error' },
      );
    }
  };
}

export default useApolloErrorHandler;
