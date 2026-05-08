'use client';

import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ContributorBadgeProps {
  count: number;
  showSupportersLabel?: boolean;
  className?: string;
}

export function ContributorBadge({ count, showSupportersLabel, className }: ContributorBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "rounded-full px-2 py-0.5 flex items-center gap-1.5 h-6 md:h-8 border-primary/10", 
        className
      )}
    >
      <Users size={12} className="text-primary" />
      <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider">
        {count.toLocaleString()} {showSupportersLabel && 'Supporters'}
      </span>
    </Badge>
  );
}
