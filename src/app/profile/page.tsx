'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  User, 
  Copy, 
  Check, 
  LogOut, 
  Edit2, 
  Loader2, 
  TrendingUp,
  HeartHandshake,
  Wallet as WalletIcon,
  Settings2,
} from 'lucide-react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomButton } from '@/components/shared/custom-button';
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
import { cn, shortenAddress } from '@/lib/utils';
import { formatUnits } from 'viem';
import { ProfileStatCard, ProfileCampaignCard, ProfileContributionCard } from '@/components/shared/profile-cards';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GET_USER_DATA = gql`
  query GetUserData($owner: Bytes!) {
    myCampaigns: campaigns(where: { owner: $owner }) {
      id
      title
      target
      amountCollectedUsd
      status
    }
    myDonations: donations(where: { donator: $owner }) {
      id
      amountEth
      amountUsd
      campaign {
        id
        title
        target
        amountCollectedUsd
      }
    }
  }
`;

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
        <CustomButton onClick={onConnect} className="rounded-full px-8 h-10 md:h-12 text-sm md:text-base font-bold shadow-lg shadow-primary/10">
          Connect Wallet
        </CustomButton>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const { prices: ethPrices } = useEthPrice();
  const { data: userBalance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    async function fetchUsername() {
      if (auth.currentUser && address) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) setUsername(userDoc.data().name);
      }
    }
    fetchUsername();
  }, [address]);

  const handleSaveName = async () => {
    if (!auth.currentUser || !address) return;
    setIsSavingName(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name: username,
        walletAddress: address.toLowerCase(),
        updatedAt: new Date(),
      }, { merge: true });
      setIsEditingUsername(false);
      toast({ title: "Profile Updated", description: "Display name saved securely." });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSavingName(false);
    }
  };

  const { data: subgraphData, loading: isSubgraphLoading } = useQuery(GET_USER_DATA, {
    variables: { owner: address?.toLowerCase() },
    skip: !address,
  });

  const processedData = useMemo(() => {
    if (!subgraphData) return { myCampaigns: [], myContributions: [], totalUSD: 0, totalContributedUSD: 0 };
    const totalUSD = subgraphData.myCampaigns.reduce((acc: number, c: any) => acc + parseFloat(formatUnits(c.amountCollectedUsd, 18)), 0);
    const totalContributedUSD = subgraphData.myDonations.reduce((acc: number, d: any) => acc + parseFloat(formatUnits(d.amountUsd, 18)), 0);
    const myContributions = subgraphData.myDonations.map((d: any) => ({
      id: d.campaign.id,
      title: d.campaign.title,
      personalContribution: parseFloat(formatUnits(d.amountEth, 18)),
      amountCollected: parseFloat(formatUnits(d.campaign.amountCollectedUsd, 18)),
      target: parseFloat(formatUnits(d.campaign.target, 18)),
      progress: Math.min((parseFloat(formatUnits(d.campaign.amountCollectedUsd, 18)) / parseFloat(formatUnits(d.campaign.target, 18))) * 100, 100)
    }));
    return { myCampaigns: subgraphData.myCampaigns, myContributions, totalUSD, totalContributedUSD };
  }, [subgraphData]);

  const ethValueInWallet = parseFloat(userBalance?.formatted || '0');
  const usdValueInWallet = ethValueInWallet * (ethPrices?.usd || 0);
  const displayAddress = shortenAddress(address || "");

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      toast({ title: "Address Copied", description: "Wallet address copied to clipboard" });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isConnected) return <NotConnectedView onConnect={openConnectModal!} />;
  if (isSubgraphLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Loader2 className="h-12 w-12 animate-spin text-primary" /><h1 className="text-lg font-bold">Syncing Ledger...</h1></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 w-full">
      <div className="flex flex-col gap-6 md:gap-8">
        <Card className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white/70 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-primary/10 to-accent/20 -z-10" />
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-2xl ring-1 ring-border/20 transition-transform">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User size={64} className="md:w-20 md:h-20" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start flex-1 gap-2">
              <div className="flex items-center gap-2">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-8 md:h-10 text-lg md:text-2xl font-bold rounded-xl" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} />
                    <CustomButton size="sm" className="rounded-xl h-8 px-4" onClick={handleSaveName} isLoading={isSavingName}>Save</CustomButton>
                    <button onClick={() => setIsEditingUsername(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl md:text-3xl font-black text-foreground">{username || "Anonymous"}</h1>
                    <button onClick={() => setIsEditingUsername(true)} className="p-1 hover:text-primary transition-colors"><Edit2 className="h-4 w-4 md:h-5 md:w-5" /></button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full group">
                <span className="text-xs md:text-sm font-mono font-medium text-muted-foreground">{displayAddress}</span>
                <button onClick={copyAddress} className="p-1 hover:text-primary transition-all active:scale-90">
                  {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <Badge variant="outline" className={cn("rounded-full gap-2 px-3 py-1 font-bold tracking-tight border-2 capitalize text-xs", chain?.id === 1 ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200")}>
                <div className={cn("w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse", chain?.id === 1 ? "bg-blue-600" : "bg-emerald-600")} />
                {chain?.name || 'Unknown Network'}
              </Badge>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em]">Active Network</span>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <Card className="p-6 md:p-8 rounded-3xl bg-primary/5 flex flex-col gap-3 shadow-sm border">
            <div className="p-3 w-fit bg-primary rounded-2xl text-white"><WalletIcon className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Balance</p>
              <h3 className="text-xl md:text-4xl font-black">{ethValueInWallet.toFixed(4)} <span className="text-sm font-bold text-muted-foreground">ETH</span></h3>
              <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">≈${usdValueInWallet.toLocaleString()}</div>
            </div>
          </Card>
          <ProfileStatCard title="Raised (USD)" value={`$${processedData.totalUSD.toLocaleString()}`} icon={TrendingUp} />
          <ProfileStatCard title="Contributed (USD)" value={`$${processedData.totalContributedUSD.toLocaleString()}`} icon={HeartHandshake} />
        </div>
        <div className="bg-white/70 backdrop-blur-xl border rounded-[2.5rem] overflow-hidden shadow-xl">
          <Tabs defaultValue="my-campaigns" className="w-full">
            <div className="bg-muted/30 p-4 border-b">
              <TabsList className="bg-background/80 p-1 rounded-2xl h-12 grid grid-cols-2 max-w-md border">
                <TabsTrigger value="my-campaigns" className="rounded-xl font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                  My Campaigns
                  <span className="flex items-center justify-center bg-muted/20 text-[10px] h-5 w-5 rounded-full border border-current opacity-70">
                    {processedData.myCampaigns.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="contributions" className="rounded-xl font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                  Contributions
                  <span className="flex items-center justify-center bg-muted/20 text-[10px] h-5 w-5 rounded-full border border-current opacity-70">
                    {processedData.myContributions.length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="my-campaigns" className="mt-0">
                {processedData.myCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedData.myCampaigns.map((c: any) => (
                      <ProfileCampaignCard key={c.id} id={c.id} title={c.title} contributors={0} status={c.status} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="p-4 bg-muted rounded-full text-muted-foreground">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-foreground">No campaigns yet</p>
                      <p className="text-xs text-muted-foreground">You haven't launched any fundraisers yet.</p>
                    </div>
                    <CustomButton asChild variant="outline" size="sm" className="rounded-full">
                      <Link href="/fundraisers/new">Launch Campaign</Link>
                    </CustomButton>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="contributions" className="mt-0">
                {processedData.myContributions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {processedData.myContributions.map((c: any) => (
                      <ProfileContributionCard key={c.id} {...c} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="p-4 bg-muted rounded-full text-muted-foreground">
                      <HeartHandshake className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-foreground">No contributions yet</p>
                      <p className="text-xs text-muted-foreground">You haven't supported any causes yet.</p>
                    </div>
                    <CustomButton asChild variant="outline" size="sm" className="rounded-full">
                      <Link href="/browse">Explore Causes</Link>
                    </CustomButton>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="flex flex-col md:flex-row gap-4"><CustomButton onClick={() => disconnect()} variant="outline" className="flex-1 rounded-2xl h-14 border-destructive/20 text-destructive font-bold gap-2"><LogOut className="h-5 w-5" />Disconnect</CustomButton><CustomButton onClick={() => openAccountModal?.()} variant="secondary" className="flex-1 rounded-2xl h-14 font-bold border"><Settings2 className="h-5 w-5 mr-2" />Settings</CustomButton></div>
      </div>
    </div>
  );
}
