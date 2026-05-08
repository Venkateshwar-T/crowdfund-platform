'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Film, Image as ImageIcon } from 'lucide-react';
import { MdVerifiedUser } from 'react-icons/md';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/custom-button';
import { Badge } from '@/components/ui/badge';
import { FAKE_CAMPAIGNS } from '@/lib/mock-data';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
  const size = 160; // Slightly smaller for mobile context
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-8">
        
        {/* 1. Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight text-foreground">
            {campaign.title}
          </h1>
          <div className="flex items-center gap-2">
             <Badge variant="secondary" className="rounded-full text-[10px] uppercase font-bold px-2 py-0">
               {campaign.status}
             </Badge>
          </div>
        </div>

        {/* 2. Media Gallery Section */}
        <div className="relative w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-2xl md:rounded-3xl border border-border/50">
            <div className="flex w-max space-x-3 p-1">
              {campaign.media.map((item, index) => (
                <div 
                  key={index} 
                  className="relative aspect-video w-[280px] md:w-[600px] overflow-hidden rounded-xl md:rounded-2xl shrink-0 bg-muted"
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`${campaign.title} media ${index}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      data-ai-hint="campaign gallery image"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Film className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* 3. Main Details Card (No Title) */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-10 shadow-xl flex flex-col gap-8">
          
          {/* User Section */}
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
              <span className="text-xs text-muted-foreground">Campaign Organizer</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Description Section */}
            <div className="flex flex-col gap-3 order-2 md:order-1">
              <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">About this campaign</h2>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col items-center justify-center gap-4 order-1 md:order-2 p-6 bg-primary/5 rounded-2xl md:rounded-3xl border border-primary/10">
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
                  <span className="text-2xl md:text-3xl font-black text-primary">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="text-center flex flex-col gap-2">
                <p className="text-xs md:text-base font-bold text-foreground">
                  ${campaign.contributedAmount.toLocaleString()} <span className="text-muted-foreground font-medium">raised of ${campaign.targetAmount.toLocaleString()}</span>
                </p>
                <Badge variant="secondary" className="mx-auto rounded-full px-3 py-0.5 flex items-center gap-1.5 h-6 md:h-8">
                  <Users size={12} className="text-primary" />
                  <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider">{campaign.contributors.toLocaleString()} Supporters</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Contribution Box */}
        <div className="p-5 md:p-8 bg-foreground rounded-2xl md:rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-xl font-bold">Fund this Campaign</h3>
            <p className="text-[10px] md:text-sm text-white/60">Enter amount to make a direct impact</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-grow md:w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
              <Input 
                type="number" 
                placeholder="0"
                className="bg-white/10 border-white/20 text-white pl-7 h-10 md:h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm font-bold"
              />
            </div>
            <CustomButton className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              Contribute
            </CustomButton>
          </div>
        </div>
      </main>
    </div>
  );
}