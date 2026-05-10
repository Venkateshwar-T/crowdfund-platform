
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Ensure the URL is valid. For local development, check your graph-node status.
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/crowdfund';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: SUBGRAPH_URL,
    // Add simple error handling for missing responses
    fetchOptions: {
      mode: 'no-cors',
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
