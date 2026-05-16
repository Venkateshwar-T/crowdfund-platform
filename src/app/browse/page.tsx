'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { formatUnits } from 'viem';
import { hexToString, trim } from 'viem';
import { BrowseFilterBar, type FilterState } from '@/components/BrowsePage/browse-filter-bar';
import { CampaignCard } from '@/components/BrowsePage/campaign-card';
import { Loader2 } from 'lucide-react';

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
      titleSearch    
      categorySearch 
      owner
      target
      deadline
      amountCollectedUsd
      status
      mediaUrls
      donations {
        id
      }
    }
  }
`;

const PAGE_SIZE = 6;

function BrowseCampaigns() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    time: 'any',
    status: 'all',
    categories: [],
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filterVariables = useMemo(() => {
    const where: any = {};
    
    if (q) {
      where.or = [
        { titleSearch_contains_nocase: q },
        { categorySearch_contains_nocase: q }
      ];
    }
  
    if (filters.categories.length > 0) {
      where.categorySearch_in = filters.categories; 
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
  });

  useEffect(() => {
    setAllCampaigns([]);
    setHasMore(true);
  }, [q, filters]);

  useEffect(() => {
    if (data?.campaigns) {
      setAllCampaigns(data.campaigns);
      if (data.campaigns.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
  }, [data]);

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);

    try {
      const nextSkip = allCampaigns.length;
      const { data: moreData } = await fetchMore({
        variables: { skip: nextSkip },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          // Deduplicate items at the cache layer to prevent identity collisions
          const seenIds = new Set(prev.campaigns.map((c: any) => c.id));
          const uniqueIncoming = fetchMoreResult.campaigns.filter((c: any) => !seenIds.has(c.id));
          
          return {
            ...prev,
            campaigns: [...prev.campaigns, ...uniqueIncoming],
          };
        },
      });

      if (moreData?.campaigns && moreData.campaigns.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Pagination error:", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, isFetchingMore, allCampaigns.length]);

  const campaigns = allCampaigns.map((c) => {
    const decodedTitle = hexToString(
      trim(c.title as `0x${string}`, { dir: 'right' })
    ).replace(/\0/g, '');

    const amountCollected = parseFloat(formatUnits(c.amountCollectedUsd, 18));
    const target = parseFloat(formatUnits(c.target, 18));
    const isExpired = (Number(c.deadline) * 1000) < Date.now();

    const goalMet = BigInt(c.amountCollectedUsd) >= BigInt(c.target) || (target - amountCollected) <= 0.05;
    
    let effectiveStatus = c.status;
    if (goalMet) effectiveStatus = 'Successful';
    else if (isExpired) effectiveStatus = 'Failed';

    return {
      id: c.slug,
      title: decodedTitle,
      images: c.mediaUrls && c.mediaUrls.length > 0 ? c.mediaUrls : [],
      ownerAddress: c.owner,
      contributedAmount: amountCollected,
      targetAmount: target,
      contributors: c.donations?.length || 0, 
      deadline: Number(c.deadline),
      status: effectiveStatus
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
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Finding latest campaigns...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-destructive font-black uppercase tracking-tighter">Something went wrong. Please try again.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
              
              <div ref={loadMoreRef} className="mt-12 flex justify-center min-h-[60px] items-center">
                {(loading || isFetchingMore) && (
                  <div className="flex flex-col items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading
                  </div>
                )}
              </div>
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
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Searching the platform...</p>
      </div>
    }>
      <BrowseCampaigns />
    </Suspense>
  );
}