'use client';

import { useState, useEffect, use, useRef, useMemo } from 'react';
import Link from 'next/link';
import { hexToString, trim } from 'viem';
import { 
  Calendar,
  Tag,
  Loader2,
  Mail,
  User,
  ChevronDown,
  Clock
} from 'lucide-react';
import { MdVerifiedUser, MdOutlineReportProblem as ReportIcon } from 'react-icons/md';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { CustomButton } from '@/components/shared/custom-button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ContributorBadge } from '@/components/shared/contributor-badge';
import { ShareButton } from '@/components/share-button';
import { ProgressCircle } from '@/components/CampaignPage/progress-circle';
import { MediaGallery } from '@/components/CampaignPage/media-gallery';
import { StaticContributionBox } from '@/components/CampaignPage/static-contribution-box';
import { FloatingCTA } from '@/components/CampaignPage/floating-cta';
import { SupporterRow } from '@/components/CampaignPage/supporter-row';
import { cn, shortenAddress } from '@/lib/utils';
import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits, parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEthPrice } from '@/hooks/use-eth-price';
import { useUserName } from '@/hooks/use-user-name';
import { useQuery, gql } from '@apollo/client';
import DOMPurify from 'dompurify';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { CampaignFailedCard } from '@/components/CampaignPage/campaign-failed-card';
import { CampaignWithdrawalCard } from '@/components/CampaignPage/campaign-withdrawal-card';

const GET_CAMPAIGN_DETAIL = gql`
  query GetCampaignDetail($slug: String!) {
    campaigns(where: { slug: $slug }, first: 1) {
      id
      owner
      title
      description
      additionalNotes
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

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const fundRef = useRef<HTMLDivElement>(null);
  const [isFundInView, setIsFundInView] = useState(false);
  const [isSupportersOpen, setIsSupportersOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  
  const { isConnected, address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: userBalance } = useBalance({ address: userAddress });
  const { toast } = useToast();
  const { prices: ethPrices } = useEthPrice();
  
  const { data: hash, writeContract, isPending: isConfirmingInWallet } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: apolloData, loading: isInitialLoading, error, refetch } = useQuery(GET_CAMPAIGN_DETAIL, {
    variables: { slug },
    pollInterval: 10000,
  });

  const campaignData = apolloData?.campaigns?.[0];
  const { displayName: ownerName, loading: ownerLoading } = useUserName(campaignData?.owner);

  const { data: hasClaimedRefundData, isLoading: isRefundStatusLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasUserClaimedRefund',
    args: campaignData && userAddress ? [BigInt(campaignData.id), userAddress as `0x${string}`] : undefined,
  });

  const hasClaimedRefund = Boolean(hasClaimedRefundData);

  const { targetUSD, isExpired, displayRaisedUSD, remainingUSD, campaign } = useMemo(() => {
    if (!campaignData) return { amountCollectedUSD: 0, targetUSD: 0, isExpired: false, effectiveStatus: 'Active', displayRaisedUSD: 0, remainingUSD: 0, campaign: null };

    const rawCollected = BigInt(campaignData.amountCollectedUsd);
    const rawTarget = BigInt(campaignData.target);
    const collected = parseFloat(formatUnits(rawCollected, 18));
    const target = parseFloat(formatUnits(rawTarget, 18));
    const deadlineDate = new Date(Number(campaignData.deadline) * 1000);
    const expired = deadlineDate < new Date();
    
    const goalMet = rawCollected >= rawTarget || (target - collected) <= 0.05;
    let status = 'Active';
    if (goalMet) status = 'Successful';
    else if (expired) status = 'Failed';

    const intendedAmount = Math.floor(collected);
    const diff = collected - intendedAmount;
    const threshold = intendedAmount * 0.015; 
    const displayAmount = (diff > 0 && diff <= threshold) ? intendedAmount : collected;

    return {
      amountCollectedUSD: collected,
      targetUSD: target,
      isExpired: expired,
      effectiveStatus: status,
      displayRaisedUSD: displayAmount,
      remainingUSD: Math.max(target - displayAmount, 0),
      campaign: {
        title: hexToString(trim(campaignData.title as `0x${string}`, { dir: 'right' })).replace(/\0/g, ''),
        category: hexToString(trim(campaignData.category as `0x${string}`, { dir: 'right' })).replace(/\0/g, ''),
        description: campaignData.description,
        media: campaignData.mediaUrls || [],
        additionalNotes: campaignData.additionalNotes,
        ownerAddress: campaignData.owner,
        contributedAmount: collected,
        targetAmount: target,
        contributors: campaignData.donations?.length || 0,
        deadline: deadlineDate,
        status: status
      }
    };
  }, [campaignData]);

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ 
        variant: "success",
        title: "Payment Confirmed", 
        description: "Your transaction has been securely confirmed on the blockchain." 
      });
      refetch();
    }
  }, [isTransactionConfirmed, refetch, toast]);

  useEffect(() => {
    if (isInitialLoading || !campaignData) return;
    const observer = new IntersectionObserver(([entry]) => setIsFundInView(entry.isIntersecting), { threshold: 0.1 });
    if (fundRef.current) observer.observe(fundRef.current);
    return () => observer.disconnect();
  }, [isInitialLoading, campaignData]);

  const handleAction = (functionName: 'donateToCampaign' | 'withdraw' | 'claimRefund', amount?: string) => {
    if (!isConnected) { 
      toast({ 
        variant: "destructive",
        title: "Wallet Required", 
        description: "Please connect your wallet to interact with this campaign." 
      }); 
      openConnectModal?.(); 
      return; 
    }
    const blockchainId = BigInt(campaignData.id); 
    let value: bigint | undefined = undefined;
    if (functionName === 'donateToCampaign') {
      const baseEth = parseFloat(amount!) / ethPrices?.usd;
      value = parseEther((baseEth * 1.005).toFixed(18));
    }
    writeContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: functionName as any, args: [blockchainId] as any, value } as any, {
      onError: () => toast({ 
        variant: "destructive",
        title: "Transaction Cancelled", 
        description: "The transaction was declined or could not be processed in your wallet." 
      })
    });
  };

  if (isInitialLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /><h1 className="text-lg font-bold uppercase text-muted-foreground">Searching...</h1></div>;
  if (error || !campaignData || !campaign) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center"><h1 className="text-2xl font-bold">Campaign not found</h1><Link href="/browse"><CustomButton variant="outline" className="rounded-full">Back to Browse</CustomButton></Link></div>;

  const isOwner = userAddress?.toLowerCase() === campaignData.owner.toLowerCase();
  const hasContributed = campaignData.donations?.some((d: any) => d.donator.toLowerCase() === userAddress?.toLowerCase());
  const sanitizeHTML = (html: string) => ({ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html });

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={campaign.status as any} />
            <div className='flex flex-row gap-2'>
              <Dialog>
                <DialogTrigger asChild><button className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-border rounded-full shadow-sm hover:shadow-md transition-all active:scale-90'><ReportIcon size={20} className="text-muted-foreground"/></button></DialogTrigger>
                <DialogContent className="p-6 rounded-2xl bg-white/90 backdrop-blur-2xl">
                  <DialogHeader className="text-center mb-4"><DialogTitle className="text-lg font-black">Report Campaign</DialogTitle></DialogHeader>
                  <Textarea placeholder="Details..." value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="min-h-[100px] rounded-2xl bg-muted/30 p-3 text-sm" />
                  <DialogFooter className="mt-4"><CustomButton asChild className="w-full rounded-2xl font-black h-11"><a href={`mailto:support@crowdfund.io?subject=Report: ${campaign.title}`}><Mail className="h-5 w-5 mr-2" />Send Report</a></CustomButton></DialogFooter>
                </DialogContent>
              </Dialog>
              <ShareButton />
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-foreground">{campaign.title}</h1>
        </div>

        <MediaGallery media={campaign.media} title={campaign.title} />

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto text-center sm:text-left">
            <ProgressCircle progress={Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100)} />
            <div className="flex flex-col gap-1">
              <p className="text-2xl md:text-3xl font-black text-foreground">${displayRaisedUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-muted-foreground text-sm font-medium">raised of <span className="text-foreground font-bold">${targetUSD.toFixed(2)}</span></p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-border/50">
            <ContributorBadge count={campaign.contributors} showSupportersLabel />
            <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5", isExpired ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10")}><Clock size={14} /> {isExpired ? 'Ended' : formatDistanceToNow(campaign.deadline, { addSuffix: true })}</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl flex flex-col gap-6 scroll-mt-32">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/10"><AvatarFallback className="bg-muted"><User size={20} /></AvatarFallback></Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1"><span className="text-sm font-bold truncate">{ownerLoading ? "..." : ownerName}</span><MdVerifiedUser color='#1C9A9C' className="h-3 w-3" /></div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">{shortenAddress(campaign.ownerAddress)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1"><h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">Category</h2><div className="flex items-center gap-2"><Tag size={14} className="text-primary"/><span className="text-sm font-bold capitalize">{campaign.category}</span></div></div>
            <div className="flex flex-col gap-1"><h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">About</h2><div className="prose prose-sm max-w-none prose-p:text-muted-foreground" dangerouslySetInnerHTML={sanitizeHTML(campaign.description)} /></div>
            {campaign.additionalNotes && <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500"><h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">Additional Notes</h2><div className="prose prose-sm max-w-none prose-p:text-muted-foreground italic" dangerouslySetInnerHTML={sanitizeHTML(campaign.additionalNotes)} /></div>}
            <div className="flex flex-col gap-1"><h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">Deadline</h2><div className="flex items-center gap-2 font-bold text-sm text-foreground"><Calendar size={14} className="text-primary"/>{format(campaign.deadline, 'MMM d, yyyy • hh:mm a')} ({formatDistanceToNow(campaign.deadline, { addSuffix: true })})</div></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl">
          <Collapsible open={isSupportersOpen} onOpenChange={setIsSupportersOpen}>
            <div className="flex items-center justify-between">
              <div><h2 className="text-[10px] font-bold uppercase tracking-widest text-primary">Supporters</h2><p className="text-sm font-bold text-foreground">{campaign.contributors.toLocaleString()} people supported this campaign</p></div>
              <CollapsibleTrigger asChild>
                <CustomButton variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-primary/10">
                  <ChevronDown className={cn("h-4 w-4 text-primary transition-transform", isSupportersOpen && "rotate-180")} />
                </CustomButton>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-6 space-y-4">
              {campaignData.donations?.length > 0 ? campaignData.donations.map((d: any, i: number) => (
                <SupporterRow key={i} address={d.donator} amountUSD={parseFloat(formatUnits(d.amountUsd, 18))} timestamp={d.timestamp} />
              )) : <div className="py-4 text-center text-muted-foreground text-sm">No supporters yet.</div>}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div ref={fundRef} className="scroll-mt-32">
          {campaign.status === 'Active' && !isOwner && (
            <StaticContributionBox onContribute={(amt) => handleAction('donateToCampaign', amt)} isConfirming={isConfirmingInWallet} isMining={isMining} isSuccess={isTransactionConfirmed} ethPrice={ethPrices} userBalance={userBalance} remainingUSD={remainingUSD} containerRef={fundRef} />
          )}
          {isOwner && campaign.status === 'Successful' && (
            <CampaignWithdrawalCard withdrawn={campaignData.withdrawn} onWithdraw={() => handleAction('withdraw')} isLoading={isMining} />
          )}
          {campaign.status === 'Failed' && (
            <CampaignFailedCard isOwner={isOwner} hasContributed={hasContributed} hasClaimedRefund={hasClaimedRefund} onClaimRefund={() => handleAction('claimRefund')} isLoading={isMining} />
          )}
        </div>
      </main>
      
      {((!isOwner && campaign.status === 'Active') || 
        (isOwner && campaign.status === 'Successful' && !campaignData.withdrawn) || 
        (campaign.status === 'Failed' && hasContributed && !isRefundStatusLoading && !hasClaimedRefund)) && (
        <FloatingCTA onContribute={() => fundRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} visible={!isFundInView} status={campaign.status as any} isOwner={isOwner} hasContributed={hasContributed}/>
      )}
    </div>
  );
}
