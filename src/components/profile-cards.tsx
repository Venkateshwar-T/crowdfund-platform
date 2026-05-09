'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Users, HeartHandshake, TrendingUp, LayoutGrid } from 'lucide-react';
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

export function ProfileStatCard({ title, value, subValue, icon: Icon, className }: ProfileStatCardProps) {
  return (
    <Card className={cn("p-6 md:p-8 rounded-[2rem] border-white/20 bg-white/50 flex flex-col gap-4 shadow-sm", className)}>
      <div className="p-3 w-fit bg-primary/10 rounded-2xl text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-2xl md:text-4xl font-black text-foreground">
          {value} {subValue && <span className="text-lg md:text-2xl font-bold text-muted-foreground">{subValue}</span>}
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
  status: 'Active' | 'Completed' | 'New';
}

export function ProfileCampaignCard({ id, title, contributors, status }: ProfileCampaignCardProps) {
  return (
    <Link href={`/browse/${id}`} className="block h-full group">
      <Card className="p-6 rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h4>
            <StatusBadge status={status} className="shrink-0" />
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
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
  target, 
  progress 
}: ProfileContributionCardProps) {
  return (
    <Link href={`/browse/${id}`} className="block group">
      <Card className="p-6 rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{title}</h4>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Your Contribution</span>
                <span className="text-lg font-black text-primary">{personalContribution.toFixed(4)} ETH</span>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Campaign Raised</span>
                <span className="text-lg font-bold text-foreground">
                  ${amountCollected.toLocaleString()} / ${target.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-muted border border-border/10" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
