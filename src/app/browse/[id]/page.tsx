
'use client';

import { useState, useEffect, use, useRef, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Film, 
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
  id,
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
  const remainingUSD = targetUSD - collectedUSD;
  
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
    <div className="p-5 md:p-8 bg-foreground rounded-3xl text-white flex flex-col items-center gap-6 shadow-2xl ring-1 ring-white/10">
      <div className="text-center w-full">
        <h3 className="text-base md:text-lg font-bold">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60">Target remaining: ${remainingUSD.toLocaleString()}</p>
      </div>
      
      {isSuccess ? (
        <div className="w-full flex items-center justify-center gap-3 bg-primary/20 px-6 py-4 rounded-2xl border border-primary/30">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-base font-bold text-white">Contribution Successful!</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">$</span>
              <Input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} disabled={isConfirming || isMining} className="bg-white/10 border-white/20 text-white pl-7 h-12 rounded-xl text-base font-bold" />
            </div>
            <CustomButton onClick={() => onContribute(amount)} isLoading={isConfirming || isMining} disabled={isInsufficient || !amount || parseFloat(amount) <= 0} className="h-12 px-8 rounded-xl font-black text-sm bg-primary">
              Contribute
            </CustomButton>
          </div>
          {amount && ethPrice && (
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-primary">{ethEstimate.toFixed(6)} ETH</span>
                {isInsufficient && <span className="text-xs text-destructive font-bold animate-pulse flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Insufficient Balance</span>}
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
  const { isConnected, address: userAddress } = useAccount();
  const { data: userBalance } = useBalance({ address: userAddress });
  const { toast } = useToast();
  const { prices: ethPrices } = useEthPrice();
  
  const { data: hash, writeContract, isPending: isConfirmingInWallet } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: apolloData, loading: isInitialLoading, error, refetch } = useQuery(GET_CAMPAIGN_DETAIL, {
    variables: { id },
  });

  const campaign = apolloData?.campaign;
  const { displayName: ownerName } = useUserName(campaign?.owner);

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ title: "Confirmed", description: "Ledger updated." });
      refetch();
    }
  }, [isTransactionConfirmed, refetch, toast]);

  const handleAction = (functionName: 'donateToCampaign' | 'withdraw' | 'claimRefund', amount?: string) => {
    if (!isConnected) return toast({ title: "Connect Wallet", variant: "destructive" });

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

  if (isInitialLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><h1 className="text-lg font-bold">Syncing Graph...</h1></div>;
  if (error || !campaign) return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4"><h1 className="text-2xl font-bold">Not Found</h1><Link href="/browse"><CustomButton variant="outline">Back</CustomButton></Link></div>;

  const targetUSD = parseFloat(formatUnits(campaign.target, 18));
  const collectedUSD = parseFloat(formatUnits(campaign.amountCollectedUsd, 18));
  const progress = Math.min((collectedUSD / targetUSD) * 100, 100);
  const isOwner = userAddress?.toLowerCase() === campaign.owner.toLowerCase();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="max-w-4xl mx-auto px-4 py-10 w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <StatusBadge status={campaign.status} />
                <ShareButton />
            </div>
            <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight">{campaign.title}</h1>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2"><AvatarFallback><User size={24} /></AvatarFallback></Avatar>
                <div className="flex flex-col">
                    <span className="text-base font-bold">{ownerName} <MdVerifiedUser className="inline h-4 w-4 text-[#1C9A9C]" /></span>
                    <span className="text-xs text-muted-foreground font-mono">{shortenAddress(campaign.owner)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6 order-2 md:order-1">
                    <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(campaign.description) }} />
                    
                    {/* Status Specific Actions */}
                    <div className="pt-6 border-t">
                        {isOwner && campaign.status === 'Successful' && !campaign.withdrawn && (
                            <CustomButton onClick={() => handleAction('withdraw')} className="w-full h-14 rounded-2xl bg-primary gap-2" isLoading={isMining}>
                                <ExternalLink size={20} /> Withdraw Funds
                            </CustomButton>
                        )}
                        {campaign.status === 'Failed' && (
                            <CustomButton onClick={() => handleAction('claimRefund')} variant="outline" className="w-full h-14 rounded-2xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/5" isLoading={isMining}>
                                <Coins size={20} /> Claim My Refund
                            </CustomButton>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 order-1 md:order-2 p-10 bg-primary/5 rounded-3xl border">
                    <ProgressCircle progress={progress} />
                    <div className="text-center">
                        <p className="text-xl md:text-2xl font-black">${collectedUSD.toLocaleString()} <span className="text-muted-foreground text-sm">/ ${targetUSD.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        </div>

        {campaign.status === 'Active' && !isOwner && (
            <ContributionBox id={id} targetUSD={targetUSD} collectedUSD={collectedUSD} onContribute={(amt: string) => handleAction('donateToCampaign', amt)} isConfirming={isConfirmingInWallet} isMining={isMining} isSuccess={isTransactionConfirmed} ethPrice={ethPrices} userBalance={userBalance} />
        )}
      </main>
    </div>
  );
}
