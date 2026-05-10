
'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  ExternalLink,
  Coins,
  Users
} from 'lucide-react';
import { MdVerifiedUser } from 'react-icons/md';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/custom-button';
import { StatusBadge } from '@/components/status-badge';
import { ShareButton } from '@/components/share-button';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatUnits, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEthPrice } from '@/hooks/use-eth-price';
import { useUserName } from '@/hooks/use-user-name';
import DOMPurify from 'dompurify';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
      donations(first: 20, orderBy: timestamp, orderDirection: desc) {
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
  const [size, setSize] = useState(220);
  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth >= 768 ? 220 : 140);
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
        <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-primary/10" />
        <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" className="text-primary transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl md:text-4xl font-black text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

function ContributionBox({ 
  targetUSD,
  collectedUSD,
  onContribute, 
  isConfirming,
  isMining,
  isSuccess,
  ethPrice,
  userBalance
}: any) {
  const [amount, setAmount] = useState('');
  const remainingUSD = Math.max(targetUSD - collectedUSD, 0);
  
  let ethEstimate = 0;
  if (amount && ethPrice) {
    ethEstimate = parseFloat(amount) / ethPrice.usd;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (parseFloat(val) > remainingUSD) {
        val = remainingUSD.toFixed(2);
    }
    setAmount(val);
  };

  const isInsufficient = userBalance && parseFloat(userBalance.formatted) < ethEstimate;

  return (
    <div className="p-6 md:p-8 bg-foreground rounded-3xl text-white flex flex-col items-center gap-6 shadow-2xl ring-1 ring-white/10 w-full max-w-md mx-auto">
      <div className="text-center w-full">
        <h3 className="text-lg md:text-xl font-black uppercase tracking-widest">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60 mt-1">Target remaining: ${remainingUSD.toLocaleString()}</p>
      </div>
      
      {isSuccess ? (
        <div className="w-full flex items-center justify-center gap-3 bg-primary/20 px-6 py-4 rounded-2xl border border-primary/30 animate-in zoom-in">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-base font-bold text-white">Gift Received!</span>
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
                className="bg-white/10 border-white/20 text-white pl-7 h-12 rounded-xl text-base font-bold focus:ring-primary/40" 
              />
            </div>
            <CustomButton 
              onClick={() => onContribute(amount)} 
              isLoading={isConfirming || isMining} 
              disabled={isInsufficient || !amount || parseFloat(amount) <= 0} 
              className="h-12 px-8 rounded-xl font-black text-sm bg-primary hover:bg-primary/90"
            >
              Contribute
            </CustomButton>
          </div>
          {amount && ethPrice && (
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-primary italic">{ethEstimate.toFixed(6)} ETH</span>
                {isInsufficient && (
                  <span className="text-[10px] text-destructive font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Insufficient Funds
                  </span>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isConnected, address: userAddress } = useAccount();
  const { data: userBalance } = useBalance({ address: userAddress });
  const { toast } = useToast();
  const { prices: ethPrices } = useEthPrice();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: hash, writeContract, isPending: isConfirmingInWallet } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: apolloData, loading: isInitialLoading, error, refetch } = useQuery(GET_CAMPAIGN_DETAIL, {
    variables: { id },
    pollInterval: 10000,
  });

  const campaign = apolloData?.campaign;
  const { displayName: ownerName } = useUserName(campaign?.owner);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ title: "Confirmed", description: "Transaction finalized on the ledger." });
      refetch();
    }
  }, [isTransactionConfirmed, refetch, toast]);

  const handleAction = (functionName: 'donateToCampaign' | 'withdraw' | 'claimRefund', amount?: string) => {
    if (!isConnected) return toast({ title: "Connect Wallet", description: "Login required for this action.", variant: "destructive" });

    const args = [BigInt(id)];
    let value = undefined;

    if (functionName === 'donateToCampaign') {
        if (!amount) return;
        const ethValue = parseFloat(amount) / ethPrices?.usd;
        value = parseEther(ethValue.toFixed(18));
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName,
      args,
      value
    });
  };

  if (isInitialLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><h1 className="text-lg font-black uppercase tracking-widest">Syncing Graph...</h1></div>;
  if (error || !campaign) return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4"><h1 className="text-2xl font-black">Campaign Not Found</h1><Link href="/browse"><CustomButton variant="outline" className="rounded-full">Back to Browse</CustomButton></Link></div>;

  const targetUSD = parseFloat(formatUnits(campaign.target, 18));
  const collectedUSD = parseFloat(formatUnits(campaign.amountCollectedUsd, 18));
  const progress = Math.min((collectedUSD / targetUSD) * 100, 100);
  const isOwner = userAddress?.toLowerCase() === campaign.owner.toLowerCase();
  const deadlineDate = new Date(Number(campaign.deadline) * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-transparent">
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 w-full flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={campaign.status} />
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Tag className="h-3 w-3" />
                    {campaign.category}
                  </div>
                </div>
                <ShareButton />
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter max-w-4xl">{campaign.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Media & Info */}
            <div className="lg:col-span-8 flex flex-col gap-10">
                {/* Carousel */}
                {campaign.mediaUrls && campaign.mediaUrls.length > 0 && (
                  <div className="relative group">
                    <Carousel setApi={setApi} className="w-full rounded-[2.5rem] overflow-hidden border shadow-2xl bg-white">
                      <CarouselContent>
                        {campaign.mediaUrls.map((url: string, index: number) => (
                          <CarouselItem key={index}>
                            <div className="relative aspect-video">
                              <Image src={url} alt={`Media ${index}`} fill className="object-cover" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                    <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-black tracking-widest">
                      {current} / {campaign.mediaUrls.length}
                    </div>
                  </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border p-8 md:p-12 shadow-xl flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary/20 p-0.5">
                          <AvatarFallback className="bg-muted text-muted-foreground"><User size={28} /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-lg font-black flex items-center gap-1.5">{ownerName} <MdVerifiedUser className="h-5 w-5 text-[#1C9A9C]" /></span>
                            <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md w-fit">{shortenAddress(campaign.owner)}</span>
                        </div>
                    </div>

                    <div className="prose prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(campaign.description) }} />
                    
                    {/* Metadata Ribbon */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-border/50">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Goal</span>
                          <span className="text-xl font-black text-foreground">${targetUSD.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</span>
                          <span className="text-xl font-black text-foreground flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> {deadlineDate}</span>
                        </div>
                        <div className="flex flex-col gap-1 hidden md:flex">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                          <span className="text-xl font-black text-foreground">{campaign.status}</span>
                        </div>
                    </div>

                    {/* Owner Actions */}
                    {isOwner && campaign.status === 'Successful' && !campaign.withdrawn && (
                        <CustomButton onClick={() => handleAction('withdraw')} className="w-full h-16 rounded-2xl bg-primary text-lg font-black gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02]" isLoading={isMining}>
                            <ExternalLink size={24} /> Withdraw Funds
                        </CustomButton>
                    )}
                    {campaign.status === 'Failed' && (
                        <CustomButton onClick={() => handleAction('claimRefund')} variant="outline" className="w-full h-16 rounded-2xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 font-black text-lg" isLoading={isMining}>
                            <Coins size={24} /> Claim My Refund
                        </CustomButton>
                    )}

                    {/* Supporters List */}
                    {campaign.donations && campaign.donations.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                          <Users className="h-6 w-6 text-primary" /> 
                          Recent Supporters ({campaign.donations.length})
                        </h3>
                        <div className="flex flex-col gap-3">
                          {campaign.donations.map((d: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border/50 shadow-sm transition-transform hover:scale-[1.01]">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8"><AvatarFallback><User size={16} /></AvatarFallback></Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold">{shortenAddress(d.donator)}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                    {new Date(Number(d.timestamp) * 1000).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-black text-primary">${parseFloat(formatUnits(d.amountUsd, 18)).toLocaleString()}</span>
                                <div className="text-[9px] text-muted-foreground font-bold italic">{parseFloat(formatUnits(d.amountEth, 18)).toFixed(6)} ETH</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>

            {/* Right Column: Progress & CTA */}
            <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
                {/* Stats Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border p-10 shadow-xl flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                    <ProgressCircle progress={progress} />
                    <div className="text-center space-y-2">
                        <p className="text-4xl font-black text-foreground">${collectedUSD.toLocaleString()}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                          Raised out of <span className="text-primary">${targetUSD.toLocaleString()}</span> goal
                        </p>
                    </div>
                </div>

                {/* CTA Card */}
                {campaign.status === 'Active' && !isOwner && (
                    <ContributionBox 
                      targetUSD={targetUSD} 
                      collectedUSD={collectedUSD} 
                      onContribute={(amt: string) => handleAction('donateToCampaign', amt)} 
                      isConfirming={isConfirmingInWallet} 
                      isMining={isMining} 
                      isSuccess={isTransactionConfirmed} 
                      ethPrice={ethPrices} 
                      userBalance={userBalance} 
                    />
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
