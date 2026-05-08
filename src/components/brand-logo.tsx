'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  logoSize?: number;
}

export function BrandLogo({ className, textClassName, logoSize = 32 }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0 group", className)}>
      <div 
        className="relative" 
        style={{ width: logoSize, height: logoSize }}
      >
        <Image 
          src="/logo.png" 
          alt="CrowdFund Logo" 
          fill 
          priority
          className="object-contain"
          data-ai-hint="company logo"
        />
      </div>
      <span className={cn("text-2xl font-bold tracking-tight text-primary whitespace-nowrap", textClassName)}>
        CrowdFund
      </span>
    </Link>
  );
}
