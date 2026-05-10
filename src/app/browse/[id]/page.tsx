
'use client';

import { useState, useEffect, use, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar,
  ChevronDown,
  Tag,
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  ExternalLink,
  Coins
} from 'lucide-react';
import { MdVerifiedUser, MdOutlineReportProblem as ReportIcon } from 'react-icons/md';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomButton } from '@/components/custom-button';
import { StatusBadge } from '@/components/status-badge';
import { ContributorBadge } from '@/components/contributor-badge';
import { ShareButton } from '@/components/share-button';
import { cn } from '@/lib/utils';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatUnits, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEthPrice } from '@/hooks/use-eth-price';
import { useUserName } from '@/hooks/use-user-name';
import { useQuery, gql } from '@apollo/client';
import DOMPurify from 'dompurify';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

const GET_CAMPAIGN_DETAIL = gql`
  query GetCampaignDetail($id: ID!) {
    campaign(id: $id) {
      id
      owner
      title
      description
      category
      target
      deadline
      amountCollectedUsd
      ethRaised
      withdrawn
      status
      mediaUrls
      donations(first: 50, orderBy: timestamp, orderDirection: desc) {
        donator
        amountUsd
        amountEth
        timestamp
      }
    }
  }
`;

function shortenAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function ProgressCircle({ progress }: { progress: number }) {
  const [size, setSize] = useState(140);

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth >= 768 ? 220 : 140);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const strokeWidth = size >= 200 ? 14 : 10;
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
        <span className="text-xl md:text-4xl font-black text-primary">{Math.round(progress)}%</span>
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

  const images = media.length > 0 ? media : ['https://picsum.photos/seed/placeholder/800/600'];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-muted aspect-video shadow-lg">
      <Carousel 
        setApi={setApi} 
        className="w-full h-full"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="ml-0 h-full">
          {images.map((url, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full min-h-[200px] md:min-h-[400px]">
                <Image
                  src={url}
                  alt={`${title} media ${index}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {images.map((_, index) => (
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
  userBalance,
  remainingUSD
}: { 
  containerRef: React.RefObject<HTMLDivElement | null>,
  onContribute: (amount: string) => void,
  isConfirming: boolean,
  isMining: boolean,
  isSuccess: boolean,
  ethPrice: any,
  userBalance: any,
  remainingUSD: number
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (parseFloat(val) > remainingUSD) {
      val = remainingUSD.toFixed(2);
    }
    setAmount(val);
  };

  return (
    <div 
      ref={containerRef}
      className="p-5 md:p-8 bg-foreground rounded-2xl md:rounded-3xl text-white flex flex-col items-center gap-6 shadow-2xl ring-1 ring-white/10 scroll-mt-24"
    >
      <div className="text-center w-full">
        <h3 className="text-base md:text-lg font-bold">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60">Target remaining: ${remainingUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
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
                onChange={handleAmountChange}
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
                  <span className="text-primary font-bold">{ethEstimate.toFixed(6)} ETH</span> | <span className="text-primary font-bold">₹{inrEstimate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
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

function SupporterRow({ address, amountUSD, timestamp }: { address: string, amountUSD: number, timestamp: string }) {
  const { displayName, loading } = useUserName(address);
  
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-background ring-1 ring-border/10">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User size={16} className="md:w-5 md:h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-foreground truncate">
            {loading ? "..." : displayName}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">
            {new Date(Number(timestamp) * 1000).toLocaleDateString()} • {shortenAddress(address)}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs md:text-base font-black text-primary">
          ${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fundRef = useRef<HTMLDivElement>(null);
  const [isFundInView, setIsFundInView] = useState(false);
  const [isSupportersOpen, setIsSupportersOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { isConnected, address: userAddress } = useAccount();
  const { data: userBalance } = useBalance({ address: userAddress });
  const { toast } = useToast();
  const { prices: ethPrices } = useEthPrice();
  
  const { data: hash, writeContract, isPending: isConfirmingInWallet } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: apolloData, loading: isInitialLoading, error, refetch } = useQuery(GET_CAMPAIGN_DETAIL, {
    variables: { id },
    pollInterval: 10000,
  });

  const campaignData = apolloData?.campaign;
  const { displayName: ownerName, loading: ownerLoading } = useUserName(campaignData?.owner);

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ title: "Confirmed!", description: "Transaction has been recorded on the blockchain." });
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

  const handleAction = (functionName: 'donateToCampaign' | 'withdraw' | 'claimRefund', amount?: string) => {
    if (!isConnected) {
      toast({ title: "Connect Wallet", description: "Login required for this action.", variant: "destructive" });
      return;
    }

    const args = [BigInt(id)];
    let value = undefined;

    if (functionName === 'donateToCampaign') {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
      const ethValue = parseFloat(amount) / ethPrices?.usd;
      value = parseEther(ethValue.toFixed(18));
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName,
      args,
      value
    }, {
      onError: (err) => toast({ title: "Action Failed", description: err.message, variant: "destructive" })
    });
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-lg font-bold text-muted-foreground">Syncing decentralized graph...</h1>
      </div>
    );
  }

  if (error || !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
        <p className="text-muted-foreground">The campaign ID might be invalid or the graph is still syncing.</p>
        <Link href="/browse"><CustomButton variant="outline" className="rounded-full">Back to Browse</CustomButton></Link>
      </div>
    );
  }

  const amountCollectedUSD = parseFloat(formatUnits(campaignData.amountCollectedUsd, 18));
  const targetUSD = parseFloat(formatUnits(campaignData.target, 18));
  const deadlineMs = Number(campaignData.deadline) * 1000;
  const isOwner = userAddress?.toLowerCase() === campaignData.owner.toLowerCase();
  const remainingUSD = Math.max(targetUSD - amountCollectedUSD, 0);

  const campaign = {
    title: campaignData.title,
    description: campaignData.description,
    category: campaignData.category.charAt(0).toUpperCase() + campaignData.category.slice(1),
    media: campaignData.mediaUrls || [],
    additionalNotes: campaignData.additionalNotes,
    ownerAddress: campaignData.owner,
    contributedAmount: amountCollectedUSD,
    targetAmount: targetUSD,
    contributors: campaignData.donations?.length || 0,
    deadline: new Date(deadlineMs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: campaignData.status
  };

  const scrollToFund = () => {
    fundRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const sanitizeHTML = (html: string) => {
    return { __html: typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html };
  };

  const reportMailto = `mailto:venkattiwari42@gmail.com?subject=Reporting Campaign: ${encodeURIComponent(campaign.title)}&body=${encodeURIComponent(reportReason)}`;

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={campaign.status} />
            <div className='flex flex-row gap-2'>
              <Dialog>
                <DialogTrigger asChild>
                  <button className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-border rounded-full shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-90 group'>
                    <ReportIcon size={24} className="text-muted-foreground group-hover:text-primary transition-colors w-4 h-4 md:w-5 md:h-5"/>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100%-2rem)] sm:max-w-xl rounded-2xl md:rounded-[2rem] border-white/20 bg-white/90 backdrop-blur-2xl shadow-2xl overflow-hidden p-4 md:p-6">
                  <DialogHeader className="flex flex-col items-center gap-2 mb-2 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-1">
                      <ReportIcon size={22} className="md:w-6 md:h-6" />
                    </div>
                    <DialogTitle className="text-lg md:text-xl font-black text-foreground">Report Campaign</DialogTitle>
                    <DialogDescription className="text-xs md:text-sm text-muted-foreground max-w-sm mx-auto">
                      Please describe your concerns regarding this fundraiser.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-3 py-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Reason for Report</label>
                      <Textarea 
                        placeholder="Provide details..."
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="min-h-[100px] rounded-2xl border-muted-foreground/20 focus-visible:ring-primary/20 bg-muted/30 p-3 text-sm"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-4">
                    <CustomButton asChild className="w-full rounded-2xl gap-3 font-black h-11 text-sm shadow-lg shadow-primary/10">
                      <a href={reportMailto}>
                        <Mail className="h-5 w-5" />
                        Send Report via Email
                      </a>
                    </CustomButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <ShareButton />
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight text-foreground">{campaign.title}</h1>
        </div>

        <MediaGallery media={campaign.media} title={campaign.title} />

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 md:h-12 md:w-12 border-2 border-background ring-1 ring-border/10">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User size={24} className="md:w-8 md:h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs md:text-base font-bold text-foreground truncate">
                  {ownerLoading ? "..." : ownerName}
                </span>
                <MdVerifiedUser color='#1C9A9C' className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-mono truncate">
                {shortenAddress(campaign.ownerAddress)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Category</h2>
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /><span className="text-xs md:text-base font-bold text-foreground">{campaign.category}</span></div>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">About</h2>
                <div 
                  className="prose prose-teal prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground [overflow-wrap:break-word] [word-break:normal]"
                  dangerouslySetInnerHTML={sanitizeHTML(campaign.description)}
                />
              </div>

              {campaign.additionalNotes && campaign.additionalNotes !== '<p></p>' && (
                <div className="flex flex-col gap-2 p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Info className="h-4 w-4" />Additional Notes
                  </h2>
                  <div 
                    className="prose prose-teal prose-sm md:prose-base max-w-none prose-p:italic prose-p:text-muted-foreground [overflow-wrap:break-word] [word-break:normal]"
                    dangerouslySetInnerHTML={sanitizeHTML(campaign.additionalNotes)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Deadline</h2>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-xs md:text-base font-bold text-foreground">{campaign.deadline}</span></div>
              </div>
            </div>

            <div className="flex flex-col h-full items-center justify-center gap-4 order-1 md:order-2 p-4 md:p-10 bg-primary/5 rounded-2xl border border-primary/10 min-h-[250px] md:min-h-[400px]">
              <ProgressCircle progress={Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100)} />
              <div className="text-center flex flex-col gap-3">
                <p className="text-sm md:text-xl font-black text-foreground">
                  ${campaign.contributedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-muted-foreground font-medium text-xs md:text-lg">/ ${campaign.targetAmount.toLocaleString()}</span>
                </p>
                <ContributorBadge count={campaign.contributors} showSupportersLabel className="mx-auto" />
              </div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && campaign.status === 'Successful' && !campaignData.withdrawn && (
            <CustomButton onClick={() => handleAction('withdraw')} className="w-full h-14 rounded-2xl bg-primary text-base font-black gap-2 shadow-xl shadow-primary/20" isLoading={isMining}>
              <ExternalLink size={20} /> Withdraw Funds
            </CustomButton>
          )}
          {campaign.status === 'Failed' && (
            <CustomButton onClick={() => handleAction('claimRefund')} variant="outline" className="w-full h-14 rounded-2xl gap-2 text-destructive border-destructive/20 font-black text-base" isLoading={isMining}>
              <Coins size={20} /> Claim My Refund
            </CustomButton>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl">
          <Collapsible open={isSupportersOpen} onOpenChange={setIsSupportersOpen}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Supporters</h2>
                <p className="text-xs md:text-base font-bold text-foreground">{campaign.contributors.toLocaleString()} gifts received from the community</p>
              </div>
              <CollapsibleTrigger asChild>
                <CustomButton variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-primary/10">
                  <ChevronDown className={cn("h-4 w-4 text-primary transition-transform duration-200", isSupportersOpen && "rotate-180")} />
                </CustomButton>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-6 space-y-4">
              {campaignData.donations && campaignData.donations.length > 0 ? campaignData.donations.map((d: any, index: number) => (
                <SupporterRow key={index} address={d.donator} amountUSD={parseFloat(formatUnits(d.amountUsd, 18))} timestamp={d.timestamp} />
              )) : <div className="py-8 text-center text-muted-foreground">No supporters yet. Be the first!</div>}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {campaign.status === 'Active' && !isOwner && (
          <StaticContributionBox 
            containerRef={fundRef} 
            onContribute={(amt) => handleAction('donateToCampaign', amt)}
            isConfirming={isConfirmingInWallet}
            isMining={isMining}
            isSuccess={isTransactionConfirmed}
            ethPrice={ethPrices}
            userBalance={userBalance}
            remainingUSD={remainingUSD}
          />
        )}
      </main>
      
      {campaign.status === 'Active' && !isOwner && (
        <FloatingCTA 
          onContribute={scrollToFund} 
          visible={!isFundInView} 
        />
      )}
    </div>
  );
}
