
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Note: Replace this with your actual Subgraph query URL
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/crowdfund/v0.0.1';

export const apolloClient = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});
