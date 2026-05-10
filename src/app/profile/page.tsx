'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  User, 
  Copy, 
  Check, 
  LogOut, 
  Edit2, 
  Loader2, 
  Search, 
  PlusCircle, 
  Settings2,
  TrendingUp,
  HeartHandshake,
  LayoutGrid,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useAccount, useDisconnect, useReadContract, useBalance } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomButton } from '@/components/custom-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useEthPrice } from '@/hooks/use-eth-price';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { formatUnits } from 'viem';
import { ProfileStatCard, ProfileCampaignCard, ProfileContributionCard } from '@/components/profile-cards';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  isCopied,
  copyAddress,
  chain,
  onSaveName,
  isSavingName
}: any) {
  return (
    <Card className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white/70 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-primary/10 to-accent/20 -z-10" />
      
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="relative group">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-2xl ring-1 ring-border/20 transition-transform">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User size={64} className="md:w-20 md:h-20" />
            </AvatarFallback>
          </Avatar>
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
                  onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
                />
                <CustomButton 
                  size="sm" 
                  className="rounded-xl h-8 px-4" 
                  onClick={onSaveName}
                  isLoading={isSavingName}
                >
                  Save
                </CustomButton>
                <button 
                  onClick={() => setIsEditingUsername(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl md:text-3xl font-black text-foreground">
                  {username || shortenedAddress}
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
            "rounded-full gap-2 px-3 py-1 font-bold tracking-tight border-2 capitalize text-xs",
            chain?.id === 1 ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
          )}>
            <div className={cn("w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse", chain?.id === 1 ? "bg-blue-600" : "bg-emerald-600")} />
            {chain?.name || 'Unknown Network'}
          </Badge>
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em]">Active Network</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Main Profile Page component
 */
export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const { prices: ethPrices } = useEthPrice();
  const { data: userBalance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const router = useRouter();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Fetch all campaigns from contract to calculate history
  const { data: campaignsRaw, isLoading: isCampaignsLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCampaigns',
  });

  // Fetch username from Firestore
  useEffect(() => {
    async function fetchUsername() {
      if (address) {
        try {
          const userDoc = await getDoc(doc(db, 'users', address.toLowerCase()));
          if (userDoc.exists()) {
            setUsername(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    }
    fetchUsername();
  }, [address]);

  const handleSaveName = async () => {
    if (!address) return;
    setIsSavingName(true);
    try {
      await setDoc(doc(db, 'users', address.toLowerCase()), {
        name: username,
        updatedAt: new Date(),
      }, { merge: true });
      setIsEditingUsername(false);
      toast({
        title: "Profile Updated",
        description: "Your display name has been saved.",
      });
    } catch (error) {
      console.error("Error saving username:", error);
      toast({
        title: "Update Failed",
        description: "Could not save your display name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const processedData = useMemo(() => {
    if (!campaignsRaw || !address) return { 
      myCampaigns: [], 
      myContributions: [], 
      totalUSD: 0, 
      totalContributedUSD: 0 
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

        // Count unique supporters using lowercase addresses
        const uniqueSupporters = new Set(c.donators.map((d: string) => d.toLowerCase()));

        return {
          id: index.toString(),
          title: c.title,
          contributors: uniqueSupporters.size,
          status,
          owner: c.owner.toLowerCase(),
          amountCollected
        };
      })
      .filter(c => c.owner === userAddr);

    const totalUSD = myCampaigns.reduce((acc, c) => acc + c.amountCollected, 0);

    // 2. My Contributions
    let totalPersonalETH = BigInt(0);
    const myContributions = all
      .map((c, index) => {
        let personalContribution = BigInt(0);
        c.donators.forEach((donator: string, dIdx: number) => {
          if (donator.toLowerCase() === userAddr) {
            personalContribution += c.donations[dIdx];
          }
        });

        if (personalContribution > BigInt(0)) {
          totalPersonalETH += personalContribution;
        }

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

    // Convert total contributed ETH to USD based on current prices
    const totalContributedUSD = parseFloat(formatUnits(totalPersonalETH, 18)) * (ethPrices?.usd || 0);

    return { myCampaigns, myContributions, totalUSD, totalContributedUSD };
  }, [campaignsRaw, address, ethPrices]);

  const ethValueInWallet = parseFloat(userBalance?.formatted || '0');
  const usdValueInWallet = ethValueInWallet * (ethPrices?.usd || 0);
  const inrValueInWallet = ethValueInWallet * (ethPrices?.inr || 0);

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
          isCopied={isCopied}
          copyAddress={copyAddress}
          chain={chain}
          onSaveName={handleSaveName}
          isSavingName={isSavingName}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-8">
          <Card className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/20 bg-primary/5 flex flex-col gap-3 md:gap-4 shadow-sm border">
            <div className="p-2.5 md:p-3 w-fit bg-primary rounded-xl md:rounded-2xl text-white">
              <WalletIcon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">My Wallet Balance</p>
              <h3 className="text-xl md:text-4xl font-black text-foreground">
                {ethValueInWallet.toFixed(4)} <span className="text-sm md:text-2xl font-bold text-muted-foreground">ETH</span>
              </h3>
              <div className="flex items-center gap-1.5 md:gap-2 mt-2">
                <span className="text-[12px] md:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">≈${usdValueInWallet.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className="text-[12px] md:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">≈₹{inrValueInWallet.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Card>

          <ProfileStatCard 
            title="Total Raised (USD)"
            value={`$${processedData.totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
          />
          <ProfileStatCard 
            title="Total Contributed (USD)"
            value={`$${processedData.totalContributedUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon={HeartHandshake}
          />
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl">
          <Tabs defaultValue="my-campaigns" className="w-full">
            <div className="bg-muted/30 p-3 md:p-6 border-b border-border/10">
              <TabsList className="bg-background/80 backdrop-blur-md p-1 rounded-xl md:rounded-2xl h-10 md:h-14 grid grid-cols-2 max-w-sm border border-border/20">
                <TabsTrigger value="my-campaigns" className="rounded-lg md:rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                  My Campaigns
                </TabsTrigger>
                <TabsTrigger value="contributions" className="rounded-lg md:rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white">
                  My Contributions
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 md:p-6">
              <TabsContent value="my-campaigns" className="mt-0 outline-none">
                <div className="flex items-center gap-2 mb-4 md:mb-6 bg-primary/5 p-2 md:p-3 rounded-lg md:rounded-2xl border border-primary/10 w-fit">
                  <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  <span className="text-[9px] md:text-xs font-bold text-primary uppercase tracking-wider">
                    Total Launched: {processedData.myCampaigns.length}
                  </span>
                </div>

                {processedData.myCampaigns.length === 0 ? (
                  <div className="p-8 md:p-12 text-center flex flex-col items-center gap-4 md:gap-6">
                    <div className="p-4 md:p-6 bg-muted rounded-full">
                      <Search className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">No campaigns launched yet</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Start your first fundraiser today and make an impact.</p>
                    </div>
                    <CustomButton asChild className="rounded-full px-6 md:px-8 h-10 md:h-12 gap-2 text-xs md:text-base">
                      <Link href="/fundraisers/new">
                        <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
                        Create Campaign
                      </Link>
                    </CustomButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {processedData.myCampaigns.map((campaign: any) => (
                      <ProfileCampaignCard 
                        key={campaign.id}
                        id={campaign.id}
                        title={campaign.title}
                        contributors={campaign.contributors}
                        status={campaign.status}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contributions" className="mt-0 outline-none">
                <div className="flex items-center gap-2 mb-4 md:mb-6 bg-primary/5 p-2 md:p-3 rounded-lg md:rounded-2xl border border-primary/10 w-fit">
                  <HeartHandshake className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  <span className="text-[9px] md:text-xs font-bold text-primary uppercase tracking-wider">
                    Total Supported: {processedData.myContributions.length}
                  </span>
                </div>

                {processedData.myContributions.length === 0 ? (
                  <div className="p-8 md:p-12 text-center flex flex-col items-center gap-4 md:gap-6">
                    <div className="p-4 md:p-6 bg-muted rounded-full">
                      <HeartHandshake className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">No contributions found</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Support a cause and join a community of changemakers.</p>
                    </div>
                    <CustomButton asChild className="rounded-full px-6 md:px-8 h-10 md:h-12 gap-2 text-xs md:text-base">
                      <Link href="/browse">
                        <Search className="h-4 w-4 md:h-5 md:w-5" />
                        Browse Campaigns
                      </Link>
                    </CustomButton>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {processedData.myContributions.map((contribution: any) => (
                      <ProfileContributionCard 
                        key={contribution.id}
                        {...contribution}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
          <CustomButton 
            onClick={handleDisconnect}
            variant="outline" 
            className="flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive font-bold gap-2 text-xs md:text-base"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            Disconnect Wallet
          </CustomButton>
          
          <CustomButton 
            onClick={() => openAccountModal?.()}
            variant="secondary"
            className="flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 font-bold border border-primary/10 text-xs md:text-base"
          >
            <Settings2 className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Wallet Settings
          </CustomButton>
        </div>

        <p className="text-center text-[8px] md:text-xs text-muted-foreground/60 max-w-sm mx-auto mt-4">
          All statistics are live and immutable, derived directly from the {chain?.name || 'blockchain'}.
        </p>

      </div>
    </div>
  );
}
