'use client';

import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'Active' | 'Successful' | 'Failed' | 'Completed' | 'New';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-red/20 shadow-sm",
      (status === 'Active' || status === 'New') ? "bg-white/80 text-primary border-primary/20" : 
      (status === 'Successful' || status === 'Completed') ? "bg-green-500/80 text-white" : 
      "bg-red-500/80 text-white",
      className
    )}>
      {status}
    </span>
  );
}