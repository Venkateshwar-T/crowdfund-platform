'use client';

import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserName } from '@/hooks/use-user-name';
import { shortenAddress } from '@/lib/utils';

export function SupporterRow({ address, amountUSD, timestamp }: { address: string, amountUSD: number, timestamp: string }) {
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
          <span className="text-[9px] text-muted-foreground font-semibold">
            {new Date(Number(timestamp) * 1000).toLocaleDateString()} • {shortenAddress(address)}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-xs md:text-base font-black text-primary">
          ${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
      </div>
    </div>
  );
}