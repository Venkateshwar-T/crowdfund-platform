
'use client';

import { CustomButton } from "@/components/custom-button";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="relative group text-center">
        {/* Subtle glow effect behind the text */}
        <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full opacity-50 transition-opacity group-hover:opacity-75" />
        
        <h1 className="relative font-headline text-6xl md:text-8xl font-bold tracking-tight text-primary select-none animate-in fade-in zoom-in duration-1000 ease-out">
          CrowdFund
        </h1>
        
        <p className="relative mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          The decentralized crowdfunding platform where innovative ideas find their community.
        </p>
        
        {/* Serene accent line */}
        <div className="mt-8 flex justify-center">
          <div className="h-1.5 w-16 rounded-full bg-secondary/60 animate-in slide-in-from-bottom-4 duration-1000 delay-300" />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <CustomButton size="lg" className="rounded-full px-10 text-lg shadow-lg">
            Start a Campaign
          </CustomButton>
          <CustomButton size="lg" variant="outline" className="rounded-full px-10 text-lg">
            Explore Projects
          </CustomButton>
        </div>
      </div>
    </main>
  );
}
