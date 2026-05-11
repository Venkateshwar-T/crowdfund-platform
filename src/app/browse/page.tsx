'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { formatUnits } from 'viem';
import { BrowseFilterBar, type FilterState } from '@/components/BrowsePage/browse-filter-bar';
import { CampaignCard } from '@/components/shared/campaign-card';
import { Loader2 } from 'lucide-react';
import { CustomButton } from '@/components/shared/custom-button';

const GET_CAMPAIGNS = gql`
  query GetCampaigns($first: Int!, $skip: Int!, $where: Campaign_filter, $orderBy: Campaign_orderBy, $orderDirection: OrderDirection) {
    campaigns(
      first: $first, 
      skip: $skip, 
      where: $where,
      orderBy: $orderBy,
      orderDirection: $orderDirection
    ) {
      id
      slug
      title
      owner
      target
      deadline
      amountCollectedUsd
      status
      mediaUrls
    }
  }
`;

const PAGE_SIZE = 6;

function BrowseCampaigns() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [skip, setSkip] = useState(0);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    time: 'any',
    status: 'all',
    categories: [],
  });

  const filterVariables = useMemo(() => {
    const where: any = {};
    if (q) {
      where.or = [
        { title_contains_nocase: q },
        { category_contains_nocase: q }
      ];
    }
    if (filters.status !== 'all') {
      where.status = filters.status;
    }
    if (filters.categories.length > 0) {
      where.category_in = filters.categories.map(c => c.toLowerCase());
    }
    let orderBy = 'deadline';
    let orderDirection = 'desc';
    if (filters.time === 'oldest') {
      orderDirection = 'asc';
    }
    return { where, orderBy, orderDirection };
  }, [q, filters]);

  const { data, loading, error, fetchMore } = useQuery(GET_CAMPAIGNS, {
    variables: { 
      first: PAGE_SIZE, 
      skip: 0, 
      where: filterVariables.where,
      orderBy: filterVariables.orderBy,
      orderDirection: filterVariables.orderDirection
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (newData) => {
        if (skip === 0) {
            setAllCampaigns(newData.campaigns);
        }
    }
  });

  useEffect(() => {
    setSkip(0);
    setAllCampaigns([]);
  }, [q, filters]);

  const handleLoadMore = async () => {
    const nextSkip = allCampaigns.length;
    const { data: moreData } = await fetchMore({
      variables: { skip: nextSkip },
    });
    if (moreData?.campaigns) {
      setAllCampaigns([...allCampaigns, ...moreData.campaigns]);
    }
  };

  const campaigns = allCampaigns.map((c) => {
    const amountCollected = parseFloat(formatUnits(c.amountCollectedUsd, 18));
    const target = parseFloat(formatUnits(c.target, 18));

    return {
      id: c.slug,
      title: c.title,
      images: c.mediaUrls && c.mediaUrls.length > 0 ? c.mediaUrls : [],
      ownerAddress: c.owner,
      contributedAmount: amountCollected,
      targetAmount: target,
      contributors: 0, 
      deadline: Number(c.deadline),
      status: c.status
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <BrowseFilterBar onFilterChange={setFilters} />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {loading && allCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Querying the decentralized graph...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-destructive font-black uppercase tracking-tighter">Failed to sync with Subgraph.</p>
              <p className="text-xs text-muted-foreground max-w-md">{error.message}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                {q ? `No results for "${q}"` : "No campaigns match your filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
              {data?.campaigns.length === PAGE_SIZE && (
                <div className="mt-12 flex justify-center">
                  <CustomButton 
                    onClick={handleLoadMore} 
                    variant="outline" 
                    className="rounded-full px-8 gap-2 border-primary/20 text-primary font-black uppercase tracking-widest text-xs"
                    isLoading={loading}
                  >
                    Load More Campaigns
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Loading discovery interface...</p>
      </div>
    }>
      <BrowseCampaigns />
    </Suspense>
  );
}
