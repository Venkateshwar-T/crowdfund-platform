'use client';

import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserName } from '@/hooks/use-user-name';
import { formatCampaignUsd, shortenAddress } from '@/lib/utils';
import { useMemo } from 'react';

export function SupporterRow({ address, amountUSD, timestamp }: { address: string, amountUSD: number, timestamp: string }) {
  const { displayName, loading } = useUserName(address);
  
  const displayAmount = useMemo(() => {
    const intendedAmount = Math.floor(amountUSD);
    const diff = amountUSD - intendedAmount;
    
    // If the difference is less than 1.5% of the intended amount (covering your 0.5% buffer)
    // and it's a small positive difference, snap it to the whole number.
    const threshold = intendedAmount * 0.015; 
    
    return (diff > 0 && diff <= threshold) ? intendedAmount : amountUSD;
  }, [amountUSD]);

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
          <span className="text-[9px] text-muted-foreground font-semibold">
            {new Date(Number(timestamp) * 1000).toLocaleDateString()} • {shortenAddress(address)}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs md:text-base font-black text-primary">
          ${displayAmount.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </span>
      </div>
    </div>
  );
}