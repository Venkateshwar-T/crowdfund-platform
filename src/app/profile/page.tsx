'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Copy, 
  Check, 
  LogOut, 
  Edit2, 
  Wallet, 
  ShieldCheck, 
  ExternalLink, 
  MoreVertical,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CustomButton } from '@/components/custom-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const router = useRouter();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('New Supporter');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Shorten address for display
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <User className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-xs mb-8">
          Please connect your wallet to view and manage your decentralized profile.
        </p>

        <CustomButton 
          onClick={() => router.push('/')}
          className="rounded-full px-8 h-10 md:h-12 text-sm md:text-base font-bold shadow-lg shadow-primary/10"
        >
          Back to Home
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 w-full">
      <div className="flex flex-col gap-8">
        
        {/* Profile Header Card */}
        <Card className="p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white/70 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-primary/10 to-accent/20 -z-10" />
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-2xl ring-1 ring-border/20">
                <AvatarImage src={avatarUrl || `https://picsum.photos/seed/${address}/200/200`} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {username[0]}
                </AvatarFallback>
              </Avatar>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-border hover:bg-primary hover:text-white transition-all group-hover:scale-110">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl p-1">
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
            </div>

            {/* User Info Section */}
            <div className="flex flex-col items-center md:items-start flex-1 gap-2">
              <div className="flex items-center gap-2">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-8 md:h-10 text-lg md:text-2xl font-bold rounded-xl"
                      autoFocus
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

            {/* Network Indicator (Desktop only in this spot) */}
            <div className="hidden md:flex flex-col items-end gap-2">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Wallet className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="rounded-full text-[10px] font-black uppercase tracking-widest">Sepolia</Badge>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Live Balance</p>
              <h3 className="text-2xl md:text-4xl font-black text-foreground">
                {balance?.formatted?.slice(0, 6)} <span className="text-lg md:text-2xl font-bold text-muted-foreground">{balance?.symbol}</span>
              </h3>
            </div>
          </Card>

          <Card className="p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Connected Via</p>
              <h3 className="text-2xl md:text-4xl font-black text-foreground">
                MetaMask
              </h3>
            </div>
          </Card>
        </div>

        {/* Mobile Network Indicator */}
        <div className="md:hidden flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Network</span>
            <span className="text-sm font-bold">{chain?.name || 'Unknown'}</span>
          </div>
          <div className={cn(
            "w-3 h-3 rounded-full animate-pulse",
            chain?.id === 1 ? "bg-blue-600" : "bg-emerald-600"
          )} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4">
          <CustomButton 
            onClick={handleDisconnect}
            variant="outline" 
            className="flex-1 rounded-2xl h-12 md:h-14 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive font-bold gap-2"
          >
            <LogOut className="h-5 w-5" />
            Disconnect Wallet
          </CustomButton>
          
          <CustomButton 
            onClick={() => router.push('/browse')}
            className="flex-1 rounded-2xl h-12 md:h-14 font-bold shadow-lg shadow-primary/20"
          >
            Explore Campaigns
          </CustomButton>
        </div>

        <p className="text-center text-[10px] md:text-xs text-muted-foreground/60 max-w-sm mx-auto mt-4">
          All financial data is pulled directly from the {chain?.name || 'blockchain'} and is immutable. Ensure your private keys are secure.
        </p>

      </div>
    </div>
  );
}
