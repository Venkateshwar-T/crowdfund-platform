'use client';

import Image from 'next/image';
import { Users, CheckCircle2, Calendar, Wallet } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface CampaignCardProps {
  title: string;
  image: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  contributedAmount: number;
  targetAmount: number;
  contributors: number;
  deadline: string;
  status: 'Active' | 'Completed' | 'New';
  className?: string;
}

export function CampaignCard({
  title,
  image,
  user,
  contributedAmount,
  targetAmount,
  contributors,
  deadline,
  status,
  className
}: CampaignCardProps) {
  const progress = Math.min((contributedAmount / targetAmount) * 100, 100);

  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  return (
    <div className={cn(
      "group bg-white rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col h-full",
      className
    )}>
      {/* Media Container */}
      <div className="relative aspect-[16/10] m-1.5 mb-0 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="campaign image"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 p-1.5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className={cn(
              "px-1.5 py-0.5 rounded-sm text-[8px] md:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20",
              status === 'Active' ? "bg-white/80 text-primary" : 
              status === 'New' ? "bg-blue-500/80 text-white" : 
              "bg-green-500/80 text-white"
            )}>
              {status}
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[8px] md:text-[10px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/10">
              <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
              {contributors}
            </div>
          </div>
          
          {/* Progress Line */}
          <div className="w-full h-1 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 md:p-6 pt-3 md:pt-5 flex flex-col flex-grow">
        {/* Metadata Bar */}
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <Avatar className="h-4 w-4 md:h-6 md:w-6 border border-background ring-1 ring-border/10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] md:text-sm font-bold tracking-tight text-foreground/80 truncate">
            {user.name}
          </span>
          {user.verified && <CheckCircle2 className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-blue-500 fill-blue-500/10" />}
        </div>

        {/* Headline */}
        <h3 className="text-sm md:text-xl font-extrabold leading-tight mb-3 md:mb-6 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Data Grid */}
        <div className="mt-auto grid grid-cols-2 gap-1.5 md:gap-3">
          <div className="p-2 md:p-3 bg-secondary/50 rounded-lg border border-border/10 flex flex-col gap-0.5 md:gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Wallet className="h-2 w-2 md:h-3 md:w-3" />
              <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-wider">Contributed</span>
            </div>
            <div className="text-[9px] md:text-sm font-black text-foreground">
              {formatCurrency(contributedAmount)} <span className="text-muted-foreground font-medium">/ {formatCurrency(targetAmount)}</span>
            </div>
          </div>
          
          <div className="p-2 md:p-3 bg-secondary/50 rounded-lg border border-border/10 flex flex-col gap-0.5 md:gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-2 w-2 md:h-3 md:w-3" />
              <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-wider">Deadline</span>
            </div>
            <div className="text-[9px] md:text-sm font-black text-foreground">
              {deadline}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
