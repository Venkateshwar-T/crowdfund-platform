'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { MdVerifiedUser } from 'react-icons/md';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/custom-button';
import { Badge } from '@/components/ui/badge';
import { FAKE_CAMPAIGNS } from '@/lib/mock-data';

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const campaign = FAKE_CAMPAIGNS.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
        <Link href="/browse">
          <CustomButton variant="outline" className="rounded-full">
            Back to Browse
          </CustomButton>
        </Link>
      </div>
    );
  }

  const progress = Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100);
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Independent Image Section */}
      <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[500px] overflow-hidden">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover"
          priority
          data-ai-hint="campaign main image"
        />
        <Link 
          href="/browse" 
          className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10 pb-20 w-full">
        {/* Main Details Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-10 shadow-2xl flex flex-col gap-8">
          
          {/* User & Title Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-background ring-1 ring-border/10">
                <AvatarImage src={campaign.user.avatar} />
                <AvatarFallback>{campaign.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm md:text-base font-bold text-foreground">
                    {campaign.user.name}
                  </span>
                  {campaign.user.verified && <MdVerifiedUser color='#1C9A9C' className="h-4 w-4" />}
                </div>
                <span className="text-xs text-muted-foreground">Organizer</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight text-foreground">
              {campaign.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Description Section */}
            <div className="flex flex-col gap-4 order-2 md:order-1">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary">Overview</h2>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col items-center justify-center gap-6 order-1 md:order-2 p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-primary/10"
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-black text-primary">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="text-center flex flex-col gap-2">
                <p className="text-sm md:text-base font-bold text-foreground">
                  ${campaign.contributedAmount.toLocaleString()} <span className="text-muted-foreground font-medium">raised out of ${campaign.targetAmount.toLocaleString()}</span>
                </p>
                <Badge variant="secondary" className="mx-auto rounded-full px-4 py-1 flex items-center gap-2 h-7 md:h-8">
                  <Users size={14} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{campaign.contributors.toLocaleString()} Contributed</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Box - Positioned below the card */}
        <div className="mt-6 p-6 md:p-8 bg-foreground rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative z-20">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold">Fund this Campaign</h3>
            <p className="text-xs md:text-sm text-white/60">Enter amount to make a direct impact</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-grow md:w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
              <Input 
                type="number" 
                placeholder="0.00"
                className="bg-white/10 border-white/20 text-white pl-8 h-10 md:h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm md:text-base font-bold"
              />
            </div>
            <CustomButton className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-sm md:text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              Contribute
            </CustomButton>
          </div>
        </div>
      </main>
    </div>
  );
}
