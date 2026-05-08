
'use client';

import { BrowseFilterBar } from '@/components/browse-filter-bar';
import { CampaignCard, type CampaignCardProps } from '@/components/campaign-card';

const FAKE_CAMPAIGNS: CampaignCardProps[] = [
  {
    title: "Global Ocean Cleanup: Removing Plastic from Our Shores",
    image: "https://picsum.photos/seed/ocean/800/600",
    user: {
      name: "Blue Horizon",
      avatar: "https://picsum.photos/seed/u1/100/100",
      verified: true
    },
    contributedAmount: 82400,
    targetAmount: 100000,
    contributors: 1450,
    deadline: "24 Oct 2024",
    status: 'New'
  },
  {
    title: "Project Nightingale: Affordable Healthcare for Rural Communities",
    image: "https://picsum.photos/seed/med/800/600",
    user: {
      name: "Unity Health",
      avatar: "https://picsum.photos/seed/u2/100/100",
      verified: true
    },
    contributedAmount: 45000,
    targetAmount: 120000,
    contributors: 890,
    deadline: "12 Nov 2024",
    status: 'Active'
  },
  {
    title: "Solar Village: Powering Schools with Renewable Energy",
    image: "https://picsum.photos/seed/solar/800/600",
    user: {
      name: "EcoBright",
      avatar: "https://picsum.photos/seed/u3/100/100",
      verified: false
    },
    contributedAmount: 15600,
    targetAmount: 30000,
    contributors: 320,
    deadline: "05 Dec 2024",
    status: 'Active'
  },
  {
    title: "Wildlife Sanctuary: Protecting Endangered Forest Species",
    image: "https://picsum.photos/seed/wildlife/800/600",
    user: {
      name: "NatureGuard",
      avatar: "https://picsum.photos/seed/u4/100/100",
      verified: true
    },
    contributedAmount: 280000,
    targetAmount: 300000,
    contributors: 4200,
    deadline: "15 Oct 2024",
    status: 'New'
  },
  {
    title: "Code for Tomorrow: Tech Education for Underprivileged Kids",
    image: "https://picsum.photos/seed/code/800/600",
    user: {
      name: "FutureMinds",
      avatar: "https://picsum.photos/seed/u5/100/100",
      verified: true
    },
    contributedAmount: 95000,
    targetAmount: 90000,
    contributors: 2100,
    deadline: "Expired",
    status: 'Completed'
  },
  {
    title: "Reforestation Project: Planting 1 Million Trees by 2025",
    image: "https://picsum.photos/seed/forest/800/600",
    user: {
      name: "GreenRoots",
      avatar: "https://picsum.photos/seed/u6/100/100",
      verified: true
    },
    contributedAmount: 12400,
    targetAmount: 50000,
    contributors: 180,
    deadline: "15 Jan 2025",
    status: 'Active'
  }
];

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
