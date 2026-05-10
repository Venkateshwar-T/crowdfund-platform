'use client';

import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { formatUnits } from 'viem';
import { BrowseFilterBar } from '@/components/browse-filter-bar';
import { CampaignCard } from '@/components/campaign-card';
import { Loader2 } from 'lucide-react';
import { CustomButton } from '@/components/custom-button';

const GET_CAMPAIGNS = gql`
  query GetCampaigns($first: Int!, $skip: Int!, $where: Campaign_filter) {
    campaigns(
      first: $first, 
      skip: $skip, 
      where: $where,
      orderBy: deadline,
      orderDirection: desc
    ) {
      id
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

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [skip, setSkip] = useState(0);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);

  const filter = q ? {
    or: [
      { title_contains_nocase: q },
      { category_contains_nocase: q }
    ]
  } : {};

  const { data, loading, error, fetchMore } = useQuery(GET_CAMPAIGNS, {
    variables: { 
      first: PAGE_SIZE, 
      skip: 0, 
      where: filter 
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (newData) => {
        if (skip === 0) {
            setAllCampaigns(newData.campaigns);
        }
    }
  });

  // Re-fetch/reset when query param changes
  useEffect(() => {
    setSkip(0);
  }, [q]);

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
    const deadlineMs = Number(c.deadline) * 1000;

    return {
      id: c.id,
      title: c.title,
      images: c.mediaUrls && c.mediaUrls.length > 0 ? c.mediaUrls : [],
      ownerAddress: c.owner,
      contributedAmount: amountCollected,
      targetAmount: target,
      contributors: 0, 
      deadline: new Date(deadlineMs).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: c.status
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <BrowseFilterBar />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {loading && allCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Querying the decentralized graph...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-destructive font-bold">Failed to sync with Subgraph.</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-muted-foreground font-medium">
                {q ? `No results for "${q}"` : "No campaigns found."}
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
                    className="rounded-full px-8 gap-2"
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
