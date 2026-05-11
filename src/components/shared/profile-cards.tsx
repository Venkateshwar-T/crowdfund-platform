'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface ProfileStatCardProps {
  title: string;
  value: string | number;
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
        <h3 className="text-xl md:text-4xl font-black text-foreground">{value}</h3>
      </div>
    </Card>
  );
}

export function ProfileCampaignCard({ id, title, status }: { id: string, title: string, status: any }) {
  return (
    <Link href={`/browse/${id}`} className="block h-full group">
      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 h-full flex flex-col justify-center shadow-sm border">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3 md:gap-4">
            <h4 className="text-sm md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">{title}</h4>
            <StatusBadge status={status} className="shrink-0 scale-90 md:scale-100 origin-top-right" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ProfileContributionCard({ id, title, personalContribution, status }: { id: string, title: string, personalContribution: number, status: any }) {
  return (
    <Link href={`/browse/${id}`} className="block group">
      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/50 hover:bg-white/80 transition-all border-white/20 shadow-sm border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm md:text-lg font-bold group-hover:text-primary transition-colors leading-tight truncate">{title}</h4>
            <div className="flex flex-col mt-2">
              <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest">Your Gift</span>
              <span className="text-sm md:text-lg font-black text-primary">{personalContribution.toFixed(4)} ETH</span>
            </div>
          </div>
          <StatusBadge status={status} className="shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
