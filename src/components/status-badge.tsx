'use client';

import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'Active' | 'Completed' | 'New';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm",
      status === 'Active' ? "bg-white/80 text-primary border-primary/20" : 
      status === 'New' ? "bg-blue-500/80 text-white" : 
      "bg-green-500/80 text-white",
      className
    )}>
      {status}
    </span>
  );
}
