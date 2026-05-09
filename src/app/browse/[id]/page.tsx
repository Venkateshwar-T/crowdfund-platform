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
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MdVerifiedUser, MdOutlineReportProblem as ReportIcon } from 'react-icons/md';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/custom-button';
import { StatusBadge } from '@/components/status-badge';
import { ContributorBadge } from '@/components/contributor-badge';
import { ShareButton } from '@/components/share-button';
import { cn } from '@/lib/utils';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatUnits, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEthPrice } from '@/hooks/use-eth-price';
import ReactMarkdown from 'react-markdown';
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

function MediaGallery({ media, title }: { media: string[]; title: string }) {
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
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="ml-0 h-full">
          {media.map((url, index) => {
            const isVideo = url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm');
            return (
              <CarouselItem key={index} className="pl-0 h-full relative">
                <div className="relative w-full h-full min-h-[200px] md:min-h-[400px]">
                  {isVideo ? (
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={url}
                      alt={`${title} media ${index}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      data-ai-hint="campaign gallery media"
                    />
                  )}
                </div>
              </CarouselItem>
            );
          })}
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

function StaticContributionBox({ 
  containerRef, 
  onContribute, 
  isConfirming,
  isMining,
  isSuccess,
  ethPrice,
  userBalance
}: { 
  containerRef: React.RefObject<HTMLDivElement | null>,
  onContribute: (amount: string) => void,
  isConfirming: boolean,
  isMining: boolean,
  isSuccess: boolean,
  ethPrice: any,
  userBalance: any
}) {
  const [amount, setAmount] = useState('');
  
  let ethEstimate = 0;
  let inrEstimate = 0;
  if (amount && ethPrice) {
    const usdVal = parseFloat(amount);
    ethEstimate = usdVal / ethPrice.usd;
    inrEstimate = usdVal * (ethPrice.inr / ethPrice.usd);
  }

  const isInsufficient = userBalance && parseFloat(userBalance.formatted) < ethEstimate;

  return (
    <div 
      ref={containerRef}
      className="p-5 md:p-8 bg-foreground rounded-2xl md:rounded-3xl text-white flex flex-col items-center gap-6 shadow-2xl ring-1 ring-white/10 scroll-mt-24"
    >
      <div className="text-center w-full">
        <h3 className="text-base md:text-lg font-bold">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60">Contribute in USD (ETH pulled from your wallet)</p>
      </div>
      
      {isSuccess ? (
        <div className="w-full flex items-center justify-center gap-3 bg-primary/20 px-6 py-4 rounded-2xl border border-primary/30 animate-in zoom-in-95">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-base font-bold text-white">Contribution Successful!</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">$</span>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isConfirming || isMining}
                className="bg-white/10 border-white/20 text-white pl-7 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-base font-bold shadow-inner"
              />
            </div>
            <CustomButton 
              onClick={() => onContribute(amount)}
              isLoading={isConfirming || isMining}
              disabled={isInsufficient || !amount || parseFloat(amount) <= 0}
              className="h-12 px-8 rounded-xl font-black text-sm shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 min-w-[140px]"
            >
              {isConfirming ? 'Confirming...' : isMining ? 'Processing...' : 'Contribute'}
            </CustomButton>
          </div>
          
          {amount && ethPrice && (
            <div className="flex flex-col gap-1.5 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-white/60">
                  <Info className="h-4 w-4" />
                  <span>Estimated: <span className="text-primary font-bold">{ethEstimate.toFixed(6)} ETH</span> | <span className="text-primary font-bold">₹{inrEstimate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                </div>
                {isInsufficient && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive font-bold animate-pulse">
                    <AlertCircle className="h-4 w-4" />
                    Insufficient Balance
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fundRef = useRef<HTMLDivElement>(null);
  const [isFundInView, setIsFundInView] = useState(false);
  const { isConnected, address: userAddress } = useAccount();
  const { data: userBalance } = useBalance({ address: userAddress });
  const { toast } = useToast();
  const { prices: ethPrices } = useEthPrice();
  
  const { data: hash, writeContract, isPending: isConfirmingInWallet } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: campaignsRaw, isLoading: isInitialLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCampaigns',
  });

  const campaignIndex = parseInt(id);
  const campaignData = (campaignsRaw as any)?.[campaignIndex];

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ title: "Contribution Confirmed!", description: "Your donation has been recorded on the blockchain." });
      refetch();
    }
  }, [isTransactionConfirmed, refetch, toast]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsFundInView(entry.isIntersecting), { 
      threshold: 0,
      rootMargin: '-100px 0px 0px 0px'
    });
    if (fundRef.current) observer.observe(fundRef.current);
    return () => observer.disconnect();
  }, []);

  const handleContribute = (amount: string) => {
    if (!isConnected) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet to contribute.", variant: "destructive" });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    const usdVal = parseFloat(amount);
    const ethToSend = usdVal / ethPrices?.usd;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'donateToCampaign',
      args: [BigInt(campaignIndex)],
      value: parseEther(ethToSend.toFixed(18)),
    }, {
      onError: (err) => toast({ title: "Transaction Failed", description: err.message, variant: "destructive" })
    });
  };

  if (isInitialLoading) {
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
        <Link href="/browse"><CustomButton variant="outline" className="rounded-full">Back to Browse</CustomButton></Link>
      </div>
    );
  }

  const amountCollectedUSD = parseFloat(formatUnits(campaignData.amountCollected, 18));
  const targetUSD = parseFloat(formatUnits(campaignData.target, 18));
  const deadlineMs = Number(campaignData.deadline) * 1000;
  
  let status: 'Active' | 'Completed' | 'New' = 'Active';
  if (amountCollectedUSD >= targetUSD) status = 'Completed';
  else if (Date.now() < deadlineMs && (deadlineMs - Date.now() > 20 * 24 * 60 * 60 * 1000)) status = 'New';

  const campaign = {
    title: campaignData.title,
    description: campaignData.description,
    category: campaignData.category,
    media: campaignData.mediaUrls || [],
    additionalNotes: campaignData.additionalNotes,
    user: {
      name: `${campaignData.owner.slice(0, 6)}...${campaignData.owner.slice(-4)}`,
      avatar: `https://picsum.photos/seed/${campaignData.owner}/100/100`,
      verified: true
    },
    contributedAmount: amountCollectedUSD,
    targetAmount: targetUSD,
    contributors: campaignData.donators.length,
    deadline: new Date(deadlineMs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: status
  };

  const scrollToFund = () => {
    fundRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={campaign.status} />
            <div className='flex flex-row gap-2'>
              <button className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-border rounded-full shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-90 group'>
                <ReportIcon size={24} className="text-muted-foreground group-hover:text-primary transition-colors w-4 h-4 md:w-5 md:h-5"/>
              </button>
              <ShareButton />
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight text-foreground">{campaign.title}</h1>
        </div>

        <MediaGallery media={campaign.media} title={campaign.title} />

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 md:h-12 md:w-12 border-2 border-background ring-1 ring-border/10">
              <AvatarImage src={campaign.user.avatar} />
              <AvatarFallback>{campaign.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs md:text-base font-bold text-foreground">{campaign.user.name}</span>
                {campaign.user.verified && <MdVerifiedUser color='#1C9A9C' className="h-3 w-3 md:h-4 md:w-4" />}
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Campaign Organizer</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Category</h2>
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /><span className="text-xs md:text-base font-bold text-foreground">{campaign.category}</span></div>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">About the Campaign</h2>
                <div className="prose prose-sm md:prose-base max-w-none prose-primary prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground">
                  <ReactMarkdown>{campaign.description}</ReactMarkdown>
                </div>
              </div>

              {campaign.additionalNotes && (
                <div className="flex flex-col gap-2 p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Info className="h-4 w-4" />Additional Notes
                  </h2>
                  <div className="prose prose-sm md:prose-base max-w-none prose-primary prose-p:italic prose-p:text-muted-foreground">
                    <ReactMarkdown>{campaign.additionalNotes}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Deadline</h2>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-xs md:text-base font-bold text-foreground">{campaign.deadline}</span></div>
              </div>
            </div>

            <div className="flex flex-col h-full items-center justify-center gap-4 order-1 md:order-2 p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <ProgressCircle progress={Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100)} />
              <div className="text-center flex flex-col gap-2">
                <p className="text-[11px] md:text-sm font-bold text-foreground">
                  ${campaign.contributedAmount.toLocaleString()} <span className="text-muted-foreground font-medium">raised of ${campaign.targetAmount.toLocaleString()}</span>
                </p>
                <ContributorBadge count={campaign.contributors} showSupportersLabel className="mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl">
          <Collapsible>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Supporters</h2>
                <p className="text-xs md:text-base font-bold text-foreground">{campaign.contributors.toLocaleString()} people have supported this cause</p>
              </div>
              <CollapsibleTrigger asChild><CustomButton variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-primary/10"><ChevronDown className="h-4 w-4 text-primary" /></CustomButton></CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-6 space-y-4">
              {campaignData.donators?.length > 0 ? campaignData.donators.map((donator: string, index: number) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-background ring-1 ring-border/10"><AvatarImage src={`https://picsum.photos/seed/${donator}/100/100`} /><AvatarFallback>{donator[0]}</AvatarFallback></Avatar>
                    <div className="flex flex-col"><span className="text-xs md:text-sm font-bold text-foreground">{donator.slice(0, 6)}...{donator.slice(-4)}</span><span className="text-[10px] text-muted-foreground">On-chain donation</span></div>
                  </div>
                </div>
              )) : <div className="py-8 text-center text-muted-foreground">No supporters yet. Be the first!</div>}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <StaticContributionBox 
          containerRef={fundRef} 
          onContribute={handleContribute}
          isConfirming={isConfirmingInWallet}
          isMining={isMining}
          isSuccess={isTransactionConfirmed}
          ethPrice={ethPrices}
          userBalance={userBalance}
        />
      </main>
      
      {!isFundInView && (
        <div className="fixed left-0 right-0 z-40 px-4 bottom-4 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl md:px-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          <div className="p-3 md:p-4 bg-foreground/90 backdrop-blur-xl rounded-2xl md:rounded-3xl text-white flex items-center justify-between gap-4 shadow-2xl ring-1 ring-white/10">
            <div className="pl-2">
              <p className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-widest">Drive Impact</p>
              <p className="text-xs md:text-sm font-bold">Help this cause</p>
            </div>
            <CustomButton onClick={scrollToFund} className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm bg-primary">Contribute Now</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
}