'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { useUserName } from '@/hooks/use-user-name';
import { cn } from '@/lib/utils';

interface ProfileStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

/**
 * Statistics Card for Profile Dashboard
 */
export function ProfileStatCard({ title, value, icon: Icon, className }: ProfileStatCardProps) {
  return (
    <Card className={cn("p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-3 md:gap-4 shadow-sm border", className)}>
      <div className="p-2.5 md:p-3 w-fit bg-primary/10 rounded-xl md:rounded-2xl text-primary">
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      <div>
        <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-xl md:text-4xl font-black text-foreground">{value}</h3>
      </div>
    </Card>
  );
}

/**
 * Compact Campaign Card for "My Campaigns"
 */
export function ProfileCampaignCard({ 
  id, 
  title, 
  amountCollected, 
  target, 
  status 
}: { 
  id: string, 
  title: string, 
  amountCollected: number, 
  target: number, 
  status: any 
}) {
  return (
    <Link href={`/browse/${id}`} className="block group w-full">
      <Card className="p-4 rounded-xl border border-border/50 bg-white/50 hover:bg-white transition-all shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs md:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h4>
            <p className="text-[10px] md:text-sm text-muted-foreground font-medium tracking-tight">
              ${amountCollected.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} / ${target.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} raised
            </p>
          </div>
          <StatusBadge status={status} className="shrink-0" />
        </div>
      </Card>
    </Link>
  );
}

/**
 * Compact Contribution Card for "My Contributions"
 */
export function ProfileContributionCard({ 
  id, 
  title, 
  ownerAddress, 
  personalContribution 
}: { 
  id: string, 
  title: string, 
  ownerAddress: string, 
  personalContribution: number 
}) {
  const { displayName, loading } = useUserName(ownerAddress);
  
  return (
    <Link href={`/browse/${id}`} className="block group w-full">
      <Card className="p-4 rounded-xl border border-border/50 bg-white/50 hover:bg-white transition-all shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h4>
            <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium tracking-tight">
              by {loading ? "..." : displayName}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm md:text-base font-black text-primary whitespace-nowrap">
              {personalContribution.toFixed(4)} ETH
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
