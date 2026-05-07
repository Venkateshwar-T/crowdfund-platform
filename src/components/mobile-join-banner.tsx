'use client';

import { CustomButton } from './custom-button';

export function MobileJoinBanner() {
  return (
    <div className="md:hidden sticky top-16 z-40 w-full bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <p className="text-xs font-medium text-muted-foreground">
          Join our community now
        </p>
        <CustomButton size="sm" className="rounded-full px-3 h-7 text-[10px] font-bold whitespace-nowrap">
          Connect Wallet
        </CustomButton>
      </div>
    </div>
  );
}
