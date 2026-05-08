'use client';

import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <User className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground max-w-xs">
        Connect your wallet to view your personalized profile and campaign contributions.
      </p>
    </div>
  );
}
