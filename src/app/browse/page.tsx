'use client';

import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { BrowseFilterBar } from '@/components/browse-filter-bar';
import { CampaignCard } from '@/components/campaign-card';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { Loader2 } from 'lucide-react';

export default function BrowsePage() {
  const { data: campaignsRaw, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCampaigns',
  });

  const campaigns = campaignsRaw ? (campaignsRaw as any[]).map((c, index) => {
    // Contract units are USD with 18 decimals
    const amountCollected = parseFloat(formatUnits(c.amountCollected, 18));
    const target = parseFloat(formatUnits(c.target, 18));
    const deadlineMs = Number(c.deadline) * 1000;

    // Status logic: 
    // NEW: created within 10 days
    // COMPLETED: goal reached
    // ACTIVE: otherwise
    const tenDaysAgo = Date.now() - (10 * 24 * 60 * 60 * 1000);
    
    let status: 'Active' | 'Completed' | 'New' = 'Active';
    if (amountCollected >= target) {
      status = 'Completed';
    } else if (Date.now() < deadlineMs && (deadlineMs - Date.now() > 20 * 24 * 60 * 60 * 1000)) {
        status = 'New';
    }

    return {
      id: index.toString(),
      title: c.title,
      images: c.mediaUrls && c.mediaUrls.length > 0 ? c.mediaUrls : ["https://picsum.photos/seed/placeholder/800/600"],
      user: {
        name: `${c.owner.slice(0, 6)}...${c.owner.slice(-4)}`,
        avatar: `https://picsum.photos/seed/${c.owner}/100/100`,
        verified: true,
      },
      contributedAmount: amountCollected,
      targetAmount: target,
      contributors: c.donators.length,
      deadline: new Date(deadlineMs).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: status
    };
  }) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <BrowseFilterBar />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Fetching campaigns from blockchain...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-destructive font-bold">Failed to load campaigns.</p>
              <p className="text-sm text-muted-foreground">Ensure you are connected to Sepolia testnet.</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
              <p className="text-muted-foreground font-medium">No campaigns found on-chain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}