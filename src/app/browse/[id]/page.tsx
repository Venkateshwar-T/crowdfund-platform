'use client';

import { useState, useEffect, use, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Film, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Tag,
  Loader2
} from 'lucide-react';
import { MdVerifiedUser, MdOutlineReportProblem } from 'react-icons/md';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/custom-button';
import { StatusBadge } from '@/components/status-badge';
import { ContributorBadge } from '@/components/contributor-badge';
import { ShareButton } from '@/components/share-button';
import { cn } from '@/lib/utils';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * Sub-component for the Progress Circle SVG
 */
function ProgressCircle({ progress }: { progress: number }) {
  const size = 140; 
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
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
        <span className="text-xl md:text-2xl font-black text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

/**
 * Section 1: Title Component
 */
function TitleSection({ title, status }: { title: string; status: 'Active' | 'Completed' | 'New' }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <StatusBadge status={status} />
        <div className='flex flex-row gap-2'>
          <button className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-border rounded-full shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-90 group'>
            <MdOutlineReportProblem size={24} className="text-muted-foreground group-hover:text-primary transition-colors w-4 h-4 md:w-5 md:h-5"/>
          </button>
          <ShareButton />
        </div>
      </div>
      <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight text-foreground">
        {title}
      </h1>
    </div>
  );
}

/**
 * Section 2: Media Gallery Component
 */
function MediaGallery({ media, title }: { media: { type: string; url: string }[]; title: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-muted aspect-video shadow-lg">
      <Carousel 
        setApi={setApi} 
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="ml-0 h-full">
          {media.map((item, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full min-h-[200px] md:min-h-[400px]">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={`${title} media ${index}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint="campaign gallery image"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <Film className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {media.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === index ? 'w-4 bg-white' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Section 3: Main Details Card Component
 */
function DetailsCard({ campaign }: { campaign: any }) {
  const progress = Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 md:h-12 md:w-12 border-2 border-background ring-1 ring-border/10">
          <AvatarImage src={campaign.user.avatar} />
          <AvatarFallback>{campaign.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs md:text-base font-bold text-foreground">
              {campaign.user.name}
            </span>
            {campaign.user.verified && <MdVerifiedUser color='#1C9A9C' className="h-3 w-3 md:h-4 md:w-4" />}
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Campaign Organizer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-6 order-2 md:order-1">

          <div className="flex flex-col gap-2">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Category</h2>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-xs md:text-base font-bold text-foreground">
                {campaign.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">About the Campaign</h2>
            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Deadline</h2>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs md:text-base font-bold text-foreground">
                {campaign.deadline}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full items-center justify-center gap-4 order-1 md:order-2 p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <ProgressCircle progress={progress} />

          <div className="text-center flex flex-col gap-2">
            <p className="text-[11px] md:text-sm font-bold text-foreground">
              {campaign.contributedAmount.toLocaleString()} ETH <span className="text-muted-foreground font-medium">raised of {campaign.targetAmount.toLocaleString()} ETH</span>
            </p>
            <ContributorBadge count={campaign.contributors} showSupportersLabel className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Section 4: Contributors List Component
 */
function ContributorsList({ count, donators, donations }: { count: number, donators: string[], donations: bigint[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Supporters</h2>
            <p className="text-xs md:text-base font-bold text-foreground">
              {count.toLocaleString()} people have supported this cause
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <CustomButton variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-primary/10">
              {isOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
            </CustomButton>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4">
            {donators && donators.map((donator, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-background ring-1 ring-border/10">
                    <AvatarImage src={`https://picsum.photos/seed/${donator}/100/100`} />
                    <AvatarFallback>{donator[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold text-foreground">{donator.slice(0, 6)}...{donator.slice(-4)}</span>
                    <span className="text-[10px] text-muted-foreground">On-chain donation</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs md:text-sm font-black text-primary">{formatEther(donations[index])} ETH</span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/**
 * Section 5: Static Contribution Box
 */
function StaticContributionBox({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div 
      ref={containerRef}
      className="p-5 md:p-8 bg-foreground rounded-2xl md:rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-2xl ring-1 ring-white/10"
    >
      <div className="text-center md:text-left">
        <h3 className="text-base md:text-lg font-bold">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60">Help drive real impact</p>
      </div>
      
      <div className="flex w-full md:w-auto items-center gap-3">
        <div className="relative flex-grow md:w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">Ξ</span>
          <Input 
            type="number" 
            placeholder="0"
            className="bg-white/10 border-white/20 text-white pl-7 h-10 md:h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm font-bold shadow-inner"
          />
        </div>
        <CustomButton className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
          Contribute
        </CustomButton>
      </div>
    </div>
  );
}

/**
 * Section 6: Floating CTA
 */
function FloatingCTA({ onContribute, visible }: { onContribute: () => void, visible: boolean }) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-in-out md:left-1/2 md:-translate-x-1/2 md:max-w-4xl md:px-0",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none",
        "md:bottom-8",
        isNavVisible ? "bottom-[calc(4rem+1rem)]" : "bottom-4"
      )}
    >
      <div className="p-3 md:p-4 bg-foreground/90 backdrop-blur-xl rounded-2xl md:rounded-3xl text-white flex items-center justify-between gap-4 shadow-2xl ring-1 ring-white/10">
        <div className="pl-2">
          <p className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-widest">Drive Impact</p>
          <p className="text-xs md:text-sm font-bold">Help this cause</p>
        </div>
        <CustomButton 
          onClick={onContribute}
          className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
        >
          Contribute Now
        </CustomButton>
      </div>
    </div>
  );
}

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fundRef = useRef<HTMLDivElement>(null);
  const [isFundInView, setIsFundInView] = useState(false);

  // Fetch campaign details from blockchain
  const { data: campaignRaw, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCampaigns',
  });

  const campaignIndex = parseInt(id);
  const campaignData = (campaignRaw as any)?.[campaignIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFundInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (fundRef.current) {
      observer.observe(fundRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToFund = () => {
    fundRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-lg font-bold text-muted-foreground">Loading campaign from blockchain...</h1>
      </div>
    );
  }

  if (isError || !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
        <p className="text-muted-foreground">Ensure you are connected to Sepolia testnet.</p>
        <Link href="/browse">
          <CustomButton variant="outline" className="rounded-full">
            Back to Browse
          </CustomButton>
        </Link>
      </div>
    );
  }

  // Map contract struct to local format
  const campaign = {
    title: campaignData.title,
    description: campaignData.description,
    category: campaignData.category,
    media: [
      { type: 'image', url: campaignData.mediaUrl || "https://picsum.photos/seed/placeholder/800/600" }
    ],
    user: {
      name: `${campaignData.owner.slice(0, 6)}...${campaignData.owner.slice(-4)}`,
      avatar: `https://picsum.photos/seed/${campaignData.owner}/100/100`,
      verified: true
    },
    contributedAmount: parseFloat(formatEther(campaignData.amountCollected)),
    targetAmount: parseFloat(formatEther(campaignData.target)),
    contributors: campaignData.donators.length,
    deadline: new Date(Number(campaignData.deadline) * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    status: Number(campaignData.deadline) * 1000 < Date.now() ? 'Completed' : 'Active' as 'Active' | 'Completed' | 'New'
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-4 md:gap-8">
        <TitleSection title={campaign.title} status={campaign.status} />
        <MediaGallery media={campaign.media as any} title={campaign.title} />
        <DetailsCard campaign={campaign} />
        <ContributorsList count={campaign.contributors} donators={campaignData.donators} donations={campaignData.donations} />
        <StaticContributionBox containerRef={fundRef} />
      </main>
      
      <FloatingCTA 
        onContribute={scrollToFund} 
        visible={!isFundInView} 
      />
    </div>
  );
}
