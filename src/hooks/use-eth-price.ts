
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEthPrice() {
  const { data, error, isLoading } = useSWR('/api/prices', fetcher, {
    refreshInterval: 60000, // Refresh every minute
  });

  return {
    prices: data?.ethereum,
    isLoading,
    isError: error,
  };
}
