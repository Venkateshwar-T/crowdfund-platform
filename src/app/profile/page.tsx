'use client';

import { User } from 'lucide-react';
import { CustomButton } from '@/components/custom-button';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <User className="h-12 w-12 text-primary" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground max-w-xs mb-8">
        Manage your fundraisers and view your contribution history in one place.
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* Wallet status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/5 border border-destructive/20">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Wallet not connected
          </span>
        </div>
        
        {/* Primary action - Resized for mobile */}
        <CustomButton className="rounded-full px-8 h-10 md:h-12 text-sm md:text-base font-bold shadow-lg shadow-primary/10">
          Connect Wallet
        </CustomButton>
      </div>
    </div>
  );
}
