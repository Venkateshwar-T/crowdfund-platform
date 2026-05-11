'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  Tag,
  Loader2,
  Info,
  Mail,
  ExternalLink,
  Coins,
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
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useBalance } from 'wagmi';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { WithdrawFundsBox } from '@/components/CampaignPage/withdraw-funds-box';
import { WithdrawSuccessCard } from '@/components/CampaignPage/withdraw-success-card';
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

  useEffect(() => {
    if (isTransactionConfirmed) {
      toast({ title: "Confirmed!", description: "Transaction has been recorded on the blockchain." });
      refetch();
    }
  }, [isTransactionConfirmed, refetch, toast]);

  useEffect(() => {
    if (isInitialLoading || !campaignData) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsFundInView(entry.isIntersecting);
    }, { 
      threshold: 0.1,
      rootMargin: '0px'
    });

    if (fundRef.current) {
      observer.observe(fundRef.current);
    }

    return () => observer.disconnect();
  }, [isInitialLoading, campaignData]);

  const handleAction = (functionName: 'donateToCampaign' | 'withdraw' | 'claimRefund', amount?: string) => {
    if (!isConnected) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet first to continue.", variant: "destructive" });
      openConnectModal?.();
      return;
    }
    const blockchainId = BigInt(campaignData.id); 
    const args = [blockchainId] as const;
    let value: bigint | undefined = undefined;
    if (functionName === 'donateToCampaign') {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
      const ethValue = parseFloat(amount) / ethPrices?.usd;
      value = parseEther(ethValue.toFixed(18));
    }
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: functionName as any, 
      args: args as any,
      value: value as any,
    } as any, {
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
  const deadlineDate = new Date(deadlineMs);
  const isExpired = deadlineDate < new Date();
  const isOwner = userAddress?.toLowerCase() === campaignData.owner.toLowerCase();
  const remainingUSD = Math.max(targetUSD - amountCollectedUSD, 0);

  const hasContributed = isConnected && userAddress && campaignData.donations?.some(
    (d: any) => d.donator.toLowerCase() === userAddress.toLowerCase()
  );

  const effectiveStatus = (campaignData.status === 'Active' && isExpired && amountCollectedUSD < targetUSD) 
    ? 'Failed' 
    : campaignData.status;

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
    deadline: deadlineDate,
    status: effectiveStatus
  };

  const scrollToFund = () => {
    fundRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const sanitizeHTML = (html: string) => {
    return { __html: typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html };
  };

  const reportMailto = `mailto:support@crowdfund.io?subject=Reporting Campaign: ${encodeURIComponent(campaign.title)}&body=${encodeURIComponent(reportReason)}`;

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-20">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={campaign.status as any} />
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

        <div ref={fundRef} className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl flex flex-col gap-6 scroll-mt-24">
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
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /><span className="text-sm md:text-base font-bold text-foreground">{campaign.category}</span></div>
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
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm md:text-base font-bold text-foreground">
                      {format(campaign.deadline, 'MMM d, yyyy • hh:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className={cn(
                      "text-[10px] md:text-xs font-bold uppercase tracking-tight",
                      isExpired ? "text-destructive" : "text-primary"
                    )}>
                      {isExpired ? 'Campaign Ended' : `${formatDistanceToNow(campaign.deadline)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full items-center justify-center gap-4 order-1 md:order-2 p-4 md:p-10 bg-primary/5 rounded-2xl border border-primary/10 min-h-[250px] md:min-h-[400px]">
              <ProgressCircle progress={Math.min((campaign.contributedAmount / campaign.targetAmount) * 100, 100)} />
              <div className="text-center flex flex-col gap-3">
                <p className="text-sm md:text-xl font-black text-foreground">
                  ${campaign.contributedAmount.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-muted-foreground font-medium text-xs md:text-lg">raised of ${campaign.targetAmount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                </p>
                <ContributorBadge count={campaign.contributors} showSupportersLabel className="mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 md:p-8 shadow-xl">
          <Collapsible open={isSupportersOpen} onOpenChange={setIsSupportersOpen}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">Supporters</h2>
                <p className="text-sm md:text-base font-bold text-foreground">{campaign.contributors.toLocaleString()} people supported this campaign</p>
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
              )) : <div className="py-8 text-sm md:text-base text-center text-muted-foreground">{isOwner ? "No supporters yet." : "No supporters yet. Be the first!"}</div>}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div ref={fundRef}>
          {campaign.status === 'Active' && !isExpired && !isOwner && (
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

          {isOwner && campaign.status === 'Successful' && (
            <CampaignWithdrawalCard 
              withdrawn={campaignData.withdrawn}
              onWithdraw={() => handleAction('withdraw')} 
              isLoading={isMining}
            />
          )}

          {campaign.status === 'Failed' && (
            <CampaignFailedCard 
              isOwner={isOwner}
              hasContributed={hasContributed}
              onClaimRefund={() => handleAction('claimRefund')}
              isLoading={isMining}
              ownerMessage="Your campaign didn't quite reach its goal, but your effort made a difference! Refunds are being processed to all supporters. You can start a new campaign anytime."
              contributorMessage="The funding goal was not met by the deadline. If you contributed, you are eligible to claim a full refund."
            />
          )}
        </div>
      </main>
      
      {(!isOwner || (isOwner && campaign.status === 'Successful' && !campaignData.withdrawn)) && (
        <FloatingCTA 
          onContribute={scrollToFund} 
          visible={!isFundInView} 
          status={campaign.status as any}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
