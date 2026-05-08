import { type CampaignCardProps } from '@/components/campaign-card';

export interface Campaign extends CampaignCardProps {
  description: string;
  media: { type: 'image' | 'video'; url: string }[];
}

export const FAKE_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    title: "Global Ocean Cleanup: Removing Plastic from Our Shores",
    image: "https://picsum.photos/seed/ocean/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/ocean1/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/ocean2/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/ocean3/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/ocean4/800/600" },
    ],
    user: {
      name: "Blue Horizon",
      avatar: "https://picsum.photos/seed/u1/100/100",
      verified: true
    },
    contributedAmount: 82400,
    targetAmount: 100000,
    contributors: 1450,
    deadline: "24 Oct 2024",
    status: 'New',
    description: "Our mission is to deploy advanced floating barriers to capture plastic waste before it reaches the deep ocean. With your help, we can clean up over 500 miles of coastline this year alone. Every contribution goes directly towards equipment and local cleanup crews."
  },
  {
    id: "2",
    title: "Project Nightingale: Affordable Healthcare for Rural Communities",
    image: "https://picsum.photos/seed/med/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/med1/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/med2/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/med3/800/600" },
    ],
    user: {
      name: "Unity Health",
      avatar: "https://picsum.photos/seed/u2/100/100",
      verified: true
    },
    contributedAmount: 45000,
    targetAmount: 120000,
    contributors: 890,
    deadline: "12 Nov 2024",
    status: 'Active',
    description: "We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans. We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans. We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans. We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans. We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans. We are building mobile medical clinics to reach villages that have no access to basic healthcare. Your funds will help us purchase medical supplies, pay for specialized staff, and maintain our fleet of health-vans."
  },
  {
    id: "3",
    title: "Solar Village: Powering Schools with Renewable Energy",
    image: "https://picsum.photos/seed/solar/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/solar1/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/solar2/800/600" },
    ],
    user: {
      name: "EcoBright",
      avatar: "https://picsum.photos/seed/u3/100/100",
      verified: false
    },
    contributedAmount: 15600,
    targetAmount: 30000,
    contributors: 320,
    deadline: "05 Dec 2024",
    status: 'Active',
    description: "Access to electricity is a luxury in many remote schools. We want to install solar panels and battery storage in 10 regional schools, providing reliable lighting and power for computers, enabling a better digital education for students."
  },
  {
    id: "4",
    title: "Wildlife Sanctuary: Protecting Endangered Forest Species",
    image: "https://picsum.photos/seed/wildlife/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/wild1/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/wild2/800/600" },
    ],
    user: {
      name: "NatureGuard",
      avatar: "https://picsum.photos/seed/u4/100/100",
      verified: true
    },
    contributedAmount: 280000,
    targetAmount: 300000,
    contributors: 4200,
    deadline: "15 Oct 2024",
    status: 'New',
    description: "The local biodiversity is under threat from illegal logging and climate change. This sanctuary provides a safe haven for rescued animals and funds reforestation efforts to restore their natural habitat."
  },
  {
    id: "5",
    title: "Code for Tomorrow: Tech Education for Underprivileged Kids",
    image: "https://picsum.photos/seed/code/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/code1/800/600" },
    ],
    user: {
      name: "FutureMinds",
      avatar: "https://picsum.photos/seed/u5/100/100",
      verified: true
    },
    contributedAmount: 95000,
    targetAmount: 90000,
    contributors: 2100,
    deadline: "Expired",
    status: 'Completed',
    description: "Teaching children to code is giving them a superpower. We provide laptops, internet access, and professional mentorship to children from low-income backgrounds, preparing them for the jobs of the future."
  },
  {
    id: "6",
    title: "Reforestation Project: Planting 1 Million Trees by 2025",
    image: "https://picsum.photos/seed/forest/800/600",
    media: [
      { type: 'image', url: "https://picsum.photos/seed/forest1/800/600" },
      { type: 'image', url: "https://picsum.photos/seed/forest2/800/600" },
    ],
    user: {
      name: "GreenRoots",
      avatar: "https://picsum.photos/seed/u6/100/100",
      verified: true
    },
    contributedAmount: 12400,
    targetAmount: 50000,
    contributors: 180,
    deadline: "15 Jan 2025",
    status: 'Active',
    description: "Trees are the lungs of our planet. Our ambitious goal is to plant one million native saplings across deforested regions. Each donation pays for saplings, soil preparation, and long-term care for the growing forest."
  }
];