'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/status-badge';
import { cn } from '@/lib/utils';

/**
 * Statistics Card for Profile Dashboard
 */
interface ProfileStatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  className?: string;
}

export function ProfileStatCard({ title, value, icon: Icon, className }: ProfileStatCardProps) {
  return (
    <Card className={cn("p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-3 md:gap-4 shadow-sm border", className)}>
      <div className="p-2.5 md:p-3 w-fit bg-primary/10 rounded-xl md:rounded-2xl text-primary">
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      <div>
        <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-xl md:text-4xl font-black text-foreground">
          {value}
        </h3>
      </div>
    </Card>
  );
}

/**
 * Custom Campaign Card for "My Campaigns" in Profile
 */
interface ProfileCampaignCardProps {
  id: string;
  title: string;
  contributors: number;
  status: 'Active' | 'Successful' | 'Failed';
}

export function ProfileCampaignCard({ id, title, contributors, status }: ProfileCampaignCardProps) {
  return (
    <Link href={`/browse/${id}`} className="block h-full group">
      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 h-full flex flex-col justify-between shadow-sm border">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-start justify-between gap-3 md:gap-4">
            <h4 className="text-sm md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {title}
            </h4>
            <StatusBadge status={status} className="shrink-0 scale-90 md:scale-100 origin-top-right" />
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {contributors.toLocaleString()} Supporters
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/**
 * Contribution Card for "My Contributions" in Profile
 */
interface ProfileContributionCardProps {
  id: string;
  title: string;
  personalContribution: number;
  amountCollected: number;
  target: number;
  progress: number;
}

export function ProfileContributionCard({ 
  id, 
  title, 
  personalContribution, 
  amountCollected, 
  progress 
}: ProfileContributionCardProps) {
  return (
    <Link href={`/browse/${id}`} className="block group">
      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <h4 className="text-sm md:text-lg font-bold group-hover:text-primary transition-colors leading-tight">{title}</h4>
            <div className="flex items-center gap-3 md:gap-4 mt-2.5">
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest">Your Gift</span>
                <span className="text-sm md:text-lg font-black text-primary">{personalContribution.toFixed(4)} ETH</span>
              </div>
              <div className="w-px h-6 md:h-8 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest">Total Raised</span>
                <span className="text-xs md:text-lg font-bold text-foreground">
                  ${amountCollected.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-48 lg:w-64 flex flex-col gap-1.5 md:gap-2">
            <div className="flex justify-between items-center text-[9px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Goal Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 md:h-2 bg-muted border border-border/10" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
