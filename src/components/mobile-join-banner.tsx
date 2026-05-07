'use client';

import { CustomButton } from './custom-button';

export function MobileJoinBanner() {
  return (
    <div className="md:hidden sticky top-16 z-40 w-full px-4 py-3 bg-primary/5 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between gap-4 bg-background/90 p-3 rounded-2xl shadow-lg border border-primary/10">
        <p className="text-sm font-semibold text-foreground/80 pl-2">
          Join our community now
        </p>
        <CustomButton size="sm" className="rounded-full px-4 h-8 text-xs whitespace-nowrap">
          Connect Wallet
        </CustomButton>
      </div>
    </div>
  );
}
