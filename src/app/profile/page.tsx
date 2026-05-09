
'use client';

import { useState, useMemo } from 'react';
import { 
  User, 
  Copy, 
  Check, 
  LogOut, 
  Edit2, 
  Wallet, 
  ShieldCheck, 
  ExternalLink, 
  Settings2,
  Trash2,
  ImageIcon,
  Loader2,
  TrendingUp,
  HeartHandshake,
  LayoutGrid,
  Search,
  PlusCircle
} from 'lucide-react';
import { useAccount, useBalance, useDisconnect, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CustomButton } from '@/components/custom-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useEthPrice } from '@/hooks/use-eth-price';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { formatUnits } from 'viem';
import { CampaignCard } from '@/components/campaign-card';
import { Progress } from '@/components/ui/progress';

/**
 * Sub-component for the state when no wallet is connected
 */
function NotConnectedView({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <User className="h-12 w-12 text-primary" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Profile Access</h1>
      <p className="text-muted-foreground max-w-xs mb-8">
        Please connect your wallet to view and manage your decentralized profile and contributions.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-destructive/50 bg-destructive/10 py-1 px-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className='text-destructive font-bold text-xs uppercase tracking-wider'>Wallet Not Connected</span>
        </div>
        
        <CustomButton 
          onClick={onConnect}
          className="rounded-full px-8 h-10 md:h-12 text-sm md:text-base font-bold shadow-lg shadow-primary/10"
        >
          Connect Wallet
        </CustomButton>
      </div>
    </div>
  );
}

/**
 * Sub-component for the main profile identity card
 */
function ProfileIdentityCard({ 
  username, 
  setUsername, 
  isEditingUsername, 
  setIsEditingUsername,
  address,
  shortenedAddress,
  avatarUrl,
  setAvatarUrl,
  isCopied,
  copyAddress,
  chain
}: any) {
  return (
    <Card className="p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white/70 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-primary/10 to-accent/20 -z-10" />
      
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="relative group">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-2xl ring-1 ring-border/20 cursor-pointer hover:scale-105 transition-transform">
                <AvatarImage src={avatarUrl || `https://picsum.photos/seed/${address}/200/200`} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {username[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="rounded-xl p-1">
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer" onClick={() => setAvatarUrl(`https://picsum.photos/seed/${Math.random()}/200/200`)}>
                <ImageIcon className="h-4 w-4" />
                <span>Change Avatar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer text-destructive focus:text-destructive" onClick={() => setAvatarUrl(null)}>
                <Trash2 className="h-4 w-4" />
                <span>Remove Avatar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button 
            onClick={() => setIsEditingUsername(true)}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-border hover:bg-primary hover:text-white transition-all group-hover:scale-110"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center md:items-start flex-1 gap-2">
          <div className="flex items-center gap-2">
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-8 md:h-10 text-lg md:text-2xl font-bold rounded-xl"
                  autoFocus
                  onBlur={() => setIsEditingUsername(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingUsername(false)}
                />
                <CustomButton size="sm" className="rounded-xl h-8 px-4" onClick={() => setIsEditingUsername(false)}>Save</CustomButton>
              </div>
            ) : (
              <>
                <h1 className="text-xl md:text-3xl font-black text-foreground">
                  {username}
                </h1>
                <button 
                  onClick={() => setIsEditingUsername(true)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full group">
            <span className="text-xs md:text-sm font-mono font-medium text-muted-foreground">
              {shortenedAddress}
            </span>
            <button 
              onClick={copyAddress}
              className="p-1 hover:text-primary transition-all active:scale-90"
            >
              {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <Badge variant="outline" className={cn(
            "rounded-full gap-2 px-3 py-1 font-bold tracking-tight border-2 capitalize",
            chain?.id === 1 ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
          )}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", chain?.id === 1 ? "bg-blue-600" : "bg-emerald-600")} />
            {chain?.name || 'Unknown Network'}
          </Badge>
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em]">Active Network</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Statistics Grid for the Profile Dashboard
 */
function DashboardStats({ totalUSD, totalETH, campaignsCount, priceLoading }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
      <Card className="p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm">
        <div className="p-3 w-fit bg-primary/10 rounded-2xl text-primary">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Total Raised (USD)</p>
          <h3 className="text-2xl md:text-4xl font-black text-foreground">
            ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h3>
        </div>
      </Card>

      <Card className="p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm">
        <div className="p-3 w-fit bg-primary/10 rounded-2xl text-primary">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Total Contributed (ETH)</p>
          <h3 className="text-2xl md:text-4xl font-black text-foreground">
            {totalETH.toFixed(4)} <span className="text-lg md:text-2xl font-bold text-muted-foreground">ETH</span>
          </h3>
        </div>
      </Card>

      <Card className="p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm">
        <div className="p-3 w-fit bg-primary/10 rounded-2xl text-primary">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Campaigns Launched</p>
          <h3 className="text-2xl md:text-4xl font-black text-foreground">
            {campaignsCount}
          </h3>
        </div>
      </Card>
    </div>
  );
}

/**
 * Main Profile Page component
 */
export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { prices: ethPrices, isLoading: priceLoading } = useEthPrice();
  const { disconnect } = useDisconnect();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const router = useRouter();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('New Supporter');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch all campaigns from contract to calculate history
  const { data: campaignsRaw, isLoading: isCampaignsLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCampaigns',
  });

  const processedData = useMemo(() => {
    if (!campaignsRaw || !address) return { 
      myCampaigns: [], 
      myContributions: [], 
      totalUSD: 0, 
      totalETH: 0 
    };

    const all = (campaignsRaw as any[]) || [];
    const userAddr = address.toLowerCase();

    // 1. My Created Campaigns
    const myCampaigns = all
      .map((c, index) => {
        const amountCollected = parseFloat(formatUnits(c.amountCollected, 18));
        const target = parseFloat(formatUnits(c.target, 18));
        const deadlineMs = Number(c.deadline) * 1000;

        let status: 'Active' | 'Completed' | 'New' = 'Active';
        if (amountCollected >= target) status = 'Completed';
        else if (Date.now() < deadlineMs && (deadlineMs - Date.now() > 20 * 24 * 60 * 60 * 1000)) status = 'New';

        return {
          id: index.toString(),
          title: c.title,
          images: c.mediaUrls && c.mediaUrls.length > 0 ? c.mediaUrls : ["https://picsum.photos/seed/placeholder/800/600"],
          user: {
            name: `${c.owner.slice(0, 6)}...${c.owner.slice(-4)}`,
            avatar: `https://picsum.photos/seed/${c.owner}/100/100`,
            verified: true,
          },
          contributedAmount: amountCollected,
          targetAmount: target,
          contributors: c.donators.length,
          deadline: new Date(deadlineMs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status,
          owner: c.owner.toLowerCase()
        };
      })
      .filter(c => c.owner === userAddr);

    const totalUSD = myCampaigns.reduce((acc, c) => acc + c.contributedAmount, 0);

    // 2. My Contributions
    const myContributions = all
      .map((c, index) => {
        let personalContribution = 0n;
        c.donators.forEach((donator: string, dIdx: number) => {
          if (donator.toLowerCase() === userAddr) {
            personalContribution += c.donations[dIdx];
          }
        });

        const amountCollected = parseFloat(formatUnits(c.amountCollected, 18));
        const target = parseFloat(formatUnits(c.target, 18));

        return {
          id: index.toString(),
          title: c.title,
          personalContribution: parseFloat(formatUnits(personalContribution, 18)),
          amountCollected,
          target,
          progress: Math.min((amountCollected / target) * 100, 100)
        };
      })
      .filter(c => c.personalContribution > 0);

    const totalETH = myContributions.reduce((acc, c) => acc + c.personalContribution, 0);

    return { myCampaigns, myContributions, totalUSD, totalETH };
  }, [campaignsRaw, address]);

  const shortenedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : 'Not connected';

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const openExplorer = () => {
    if (address && chain) {
      const baseUrl = chain.blockExplorers?.default.url || 'https://etherscan.io';
      window.open(`${baseUrl}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return <NotConnectedView onConnect={openConnectModal!} />;
  }

  if (isCampaignsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-lg font-bold text-muted-foreground">Syncing your on-chain activity...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 w-full">
      <div className="flex flex-col gap-6 md:gap-8">
        
        <ProfileIdentityCard 
          username={username}
          setUsername={setUsername}
          isEditingUsername={isEditingUsername}
          setIsEditingUsername={setIsEditingUsername}
          address={address}
          shortenedAddress={shortenedAddress}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          isCopied={isCopied}
          copyAddress={copyAddress}
          chain={chain}
        />

        <DashboardStats 
          totalUSD={processedData.totalUSD}
          totalETH={processedData.totalETH}
          campaignsCount={processedData.myCampaigns.length}
          priceLoading={priceLoading}
        />

        <Tabs defaultValue="my-campaigns" className="mt-8">
          <TabsList className="bg-white/50 backdrop-blur-md p-1 rounded-2xl h-12 md:h-14 mb-8 grid grid-cols-2 max-w-md border border-white/20">
            <TabsTrigger value="my-campaigns" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              My Campaigns
            </TabsTrigger>
            <TabsTrigger value="contributions" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              Contributions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-campaigns" className="mt-0">
            {processedData.myCampaigns.length === 0 ? (
              <Card className="p-12 text-center flex flex-col items-center gap-6 bg-white/50 rounded-[2.5rem] border-white/20">
                <div className="p-6 bg-muted rounded-full">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">No campaigns launched yet</h3>
                  <p className="text-muted-foreground mt-2">Start your first fundraiser today and make an impact.</p>
                </div>
                <CustomButton asChild className="rounded-full px-8 gap-2">
                  <Link href="/fundraisers/new">
                    <PlusCircle className="h-5 w-5" />
                    Create Campaign
                  </Link>
                </CustomButton>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedData.myCampaigns.map((campaign: any) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contributions" className="mt-0">
            {processedData.myContributions.length === 0 ? (
              <Card className="p-12 text-center flex flex-col items-center gap-6 bg-white/50 rounded-[2.5rem] border-white/20">
                <div className="p-6 bg-muted rounded-full">
                  <HeartHandshake className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">No contributions found</h3>
                  <p className="text-muted-foreground mt-2">Support a cause and join a community of changemakers.</p>
                </div>
                <CustomButton asChild className="rounded-full px-8 gap-2">
                  <Link href="/browse">
                    <Search className="h-5 w-5" />
                    Browse Campaigns
                  </Link>
                </CustomButton>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {processedData.myContributions.map((contribution: any) => (
                  <Link key={contribution.id} href={`/browse/${contribution.id}`}>
                    <Card className="p-6 rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{contribution.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Your Contribution</span>
                              <span className="text-lg font-black text-primary">{contribution.personalContribution.toFixed(4)} ETH</span>
                            </div>
                            <div className="w-px h-8 bg-border/50" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Campaign Raised</span>
                              <span className="text-lg font-bold text-foreground">
                                ${contribution.amountCollected.toLocaleString()} / ${contribution.target.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-64 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(contribution.progress)}%</span>
                          </div>
                          <Progress value={contribution.progress} className="h-2 bg-muted border border-border/10" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8">
          <CustomButton 
            onClick={handleDisconnect}
            variant="outline" 
            className="flex-1 rounded-2xl h-12 md:h-14 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive font-bold gap-2"
          >
            <LogOut className="h-5 w-5" />
            Disconnect Wallet
          </CustomButton>
          
          <CustomButton 
            onClick={() => openAccountModal?.()}
            variant="secondary"
            className="flex-1 rounded-2xl h-12 md:h-14 font-bold border border-primary/10"
          >
            <Settings2 className="h-5 w-5 mr-2" />
            Wallet Settings
          </CustomButton>
        </div>

        <p className="text-center text-[10px] md:text-xs text-muted-foreground/60 max-w-sm mx-auto mt-4">
          All statistics are live and immutable, derived directly from the {chain?.name || 'blockchain'}.
        </p>

      </div>
    </div>
  );
}
