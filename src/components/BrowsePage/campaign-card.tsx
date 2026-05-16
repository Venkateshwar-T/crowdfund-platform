'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Calendar, Wallet, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MdVerifiedUser  } from "react-icons/md";
import { useUserName } from '@/hooks/use-user-name';
import { cn, formatCampaignUsd, formatCurrency } from '@/lib/utils';
import { STATUS_CONFIG, FALLBACK_IMAGE, type CampaignStatus } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export interface CampaignCardProps {
  id: string;
  title: string;
  images: string[];
  ownerAddress: string;
  contributedAmount: number;
  targetAmount: number;
  contributors: number;
  deadline: number; // Unix timestamp in seconds
  status: CampaignStatus;
  className?: string;
}

export function CampaignCard({
  id,
  title,
  images,
  ownerAddress,
  contributedAmount,
  targetAmount,
  contributors,
  deadline,
  status,
  className
}: CampaignCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Progress bar clamped at 100%
  const progress = Math.min((contributedAmount / targetAmount) * 100, 100);
  const { displayName, loading: nameLoading } = useUserName(ownerAddress);

  const deadlineDate = new Date(Number(deadline) * 1000);
  const isExpired = deadlineDate < new Date();
  const timeRemaining = isExpired ? 'Ended' : `${formatDistanceToNow(deadlineDate)} left`;

  // 1. CLEAN DISPLAY VALUES (No $5.01 technical surplus)
  // const displayContributed = formatCampaignUsd(contributedAmount, targetAmount);

  // UI Ceiling ($5.01 -> $5.00)
  const intendedAmount = Math.floor(contributedAmount);
  const diff = contributedAmount - intendedAmount;
  const threshold = intendedAmount * 0.015;
  const displayAmount = (diff > 0 && diff <= threshold) ? intendedAmount : contributedAmount;

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Link href={`/browse/${id}`} className="block h-full">
      <div className={cn(
        "group bg-white rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col h-full",
        className
      )}>
        {/* Image / Progress Overlay */}
        <div className="relative aspect-[16/10] m-2 md:m-3 rounded-xl overflow-hidden bg-muted">
          {isImageLoading && <Skeleton className="absolute inset-0 z-10 w-full h-full" />}
          
          {images.length > 0 ? images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={title}
              fill
              onLoad={() => { if (idx === currentImageIndex) setIsImageLoading(false); }}
              className={cn(
                "object-cover transition-opacity duration-1000",
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              )}
            />
          )) : (
            <Image src={FALLBACK_IMAGE} alt="Fallback" fill className="object-cover opacity-50" />
          )}
          
          <div className="absolute inset-0 p-1.5 md:p-2 flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
              <span className={cn(
                "px-1.5 py-0.5 rounded-sm text-[8px] md:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20",
                STATUS_CONFIG[status]?.className || "bg-white/80 text-primary"
              )}>
                {status}
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[8px] md:text-[10px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/10">
                <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
                {contributors}
              </div>
            </div>
            
            <div className="w-full h-1 md:h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
              <div className="h-full bg-[#3CC06C] transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 flex flex-col flex-grow">
          {/* Owner Info */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5 md:h-6 md:w-6 border border-background">
              <AvatarFallback className="text-[8px] md:text-[10px] bg-muted"><User size={12} /></AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[10px] md:text-xs font-bold tracking-tight text-foreground/80 truncate">
                {nameLoading ? "..." : displayName}
              </span>
              <MdVerifiedUser color='#1C9A9C' className="h-3 w-3 md:h-3.5 md:w-3.5" />
            </div>
          </div>

          <h3 className="text-xs md:text-sm lg:text-base font-extrabold leading-tight mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="mt-auto grid grid-cols-2 gap-1.5 md:gap-3">
            <div className="p-2 md:p-3 bg-secondary/50 rounded-sm md:rounded-lg border border-border/10">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Wallet className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest">Raised</span>
              </div>
              <div className="text-[10px] md:text-sm font-black text-foreground truncate">
                {/* USE CLEAN DISPLAY VALUE HERE */}
                ${displayAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[8px] md:text-[11px] text-muted-foreground font-medium">/ ${targetAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="p-2 md:p-3 bg-secondary/50 rounded-lg border border-border/10">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest">Deadline</span>
              </div>
              <div className={cn("text-[10px] md:text-sm font-black", isExpired ? "text-destructive" : "text-foreground")}>
                {timeRemaining}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}