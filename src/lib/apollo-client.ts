import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Get the URL from environment variables
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!SUBGRAPH_URL) {
  console.error("NEXT_PUBLIC_SUBGRAPH_URL is not defined in your environment variables.");
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: SUBGRAPH_URL,
    // REMOVED: fetchOptions with no-cors. The Graph handles CORS 
    // automatically, so we don't need to specify a mode here.
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache', // Good for development to see fresh data
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});