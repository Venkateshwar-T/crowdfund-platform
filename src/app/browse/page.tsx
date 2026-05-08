'use client';

import { BrowseFilterBar } from '@/components/browse-filter-bar';
import { CampaignCard } from '@/components/campaign-card';
import { FAKE_CAMPAIGNS } from '@/lib/mock-data';

export default function BrowsePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowseFilterBar />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {FAKE_CAMPAIGNS.map((campaign, index) => (
              <CampaignCard key={index} {...campaign} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
