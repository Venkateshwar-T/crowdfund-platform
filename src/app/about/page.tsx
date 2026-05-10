'use client';

import { 
  ShieldCheck, 
  Eye, 
  Database, 
  Lock, 
  Zap, 
  Cpu, 
  Globe, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Circle
} from 'lucide-react';
import { CustomButton } from '@/components/custom-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CORE_PILLARS = [
  {
    title: "Decentralized Storage",
    description: "Your campaign media and descriptions are stored on IPFS, meaning they aren't sitting on a single company's server. They are part of the permanent web.",
    icon: Database,
    accent: "text-[#9CC2C6]"
  },
  {
    title: "Automated Escrow",
    description: "Our smart contract holds all contributions. If the goal isn't met, the code—not a person—handles the refunds automatically.",
    icon: Lock,
    accent: "text-[#78999D]"
  },
  {
    title: "Radical Transparency",
    description: "Every cent raised is visible on the blockchain. No hidden fees, no 'lost' transactions, and no arbitrary freezes.",
    icon: Eye,
    accent: "text-primary"
  }
];

const TECH_STACK = [
  { name: "Ethereum (Sepolia)", icon: Cpu, desc: "Smart Contract Logic" },
  { name: "Chainlink", icon: Zap, desc: "Price Oracle Hub" },
  { name: "IPFS", icon: Globe, desc: "Distributed Storage" }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative w-full pt-6 pb-6 md:pt-10 md:pb-8 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Circle className="h-2 w-2 fill-current" />
            The Mission
          </div>
          <h1 className="text-3xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-4 max-w-5xl">
            Power back to <br />
            <span className="text-primary italic pr-4">
              the creators.
            </span>
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Traditional platforms take massive cuts and freeze funds. We built this to eliminate the middleman and replace them with open, immutable code.
          </p>
        </div>
        
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]" />
      </section>

      {/* Bento Grid: Problem & Solution */}
      <section className="w-full py-2 md:py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {/* The Problem */}
            <div className="md:col-span-5 p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/50 backdrop-blur-md border border-border/50 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
              <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">The Problem</h2>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  Web2 crowdfunding is broken. High fees, centralized censorship, and opaque payout schedules force creators to wait weeks for their own money.
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="md:col-span-7 p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-white/50 backdrop-blur-md border border-border/50 flex flex-col gap-3 md:gap-4 relative overflow-hidden group">
              <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">The Solution</h2>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-md">
                  By using the Ethereum blockchain, we replace human intermediaries with a Smart Contract. It is transparent, permissionless, and impossible to shut down.
                </p>
              </div>
              <div className="absolute bottom-[-15%] right-[-10%] opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110 pointer-events-none">
                <ShieldCheck className="w-20 h-20 md:w-60 md:h-60 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Innovation: USD Hub */}
      <section className="w-full py-4 md:py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-border/50 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center relative z-10">
              <div className="space-y-3 md:space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#78999D]/10 border border-[#78999D]/20 text-[#78999D] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                  Market Stability
                </div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-none text-foreground">
                  The Innovation: <br />
                  <span className="text-[#1C9A9C]">The USD Hub</span>
                </h2>
                <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
                  Volatility is the enemy. Raising 10 ETH today might be worth less tomorrow. We fixed that using <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">Chainlink Price Oracles</span>.
                </p>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-[160px] md:max-w-xs aspect-square">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[40px] md:blur-[80px]" />
                  <div className="relative z-10 w-full h-full rounded-2xl md:rounded-[2.5rem] bg-white/60 border border-border/50 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 text-center gap-2 md:gap-4 shadow-2xl">
                    <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-[#9CC2C6]" />
                    <div className="space-y-0.5 md:space-y-1">
                      <div className="text-xl md:text-3xl font-black text-foreground">$5,000</div>
                      <div className="text-[7px] md:text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em]">Target Value Locked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="w-full py-4 md:py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 md:gap-8">
          <div className="flex flex-col gap-1 md:gap-2">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-foreground">Core Pillars</h2>
            <div className="h-1 w-10 md:h-1.5 md:w-16 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {CORE_PILLARS.map((pillar, i) => (
              <div key={i} className="p-5 md:p-8 rounded-xl md:rounded-[2rem] bg-white/50 backdrop-blur-md border border-border/50 hover:border-primary/20 hover:bg-white transition-all duration-500 flex flex-col gap-3 md:gap-4 group shadow-sm">
                <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-white border border-border flex items-center justify-center transition-transform duration-500 group-hover:scale-110", pillar.accent)}>
                  <pillar.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Ribbon */}
      <section className="w-full py-4 md:py-8 px-6 border-y border-border/50 bg-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-around items-center gap-4 md:gap-8">
            {TECH_STACK.map((tech, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 group">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-500 shadow-sm">
                  <tech.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <div className="text-xs md:text-base font-black text-foreground">{tech.name}</div>
                  <div className="text-[7px] md:text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em]">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Matches FAQ style */}
      <section className="w-full py-12 md:py-20 px-6 bg-foreground text-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 md:gap-10">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none">
            Ready to build <br />
            <span className="text-primary italic">the future?</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <CustomButton asChild className="rounded-full px-6 md:px-10 h-11 md:h-14 text-xs md:text-base font-black bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/fundraisers/new" className="flex items-center gap-2">
                Launch Campaign <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="rounded-full px-6 md:px-10 h-11 md:h-14 text-xs md:text-base font-black border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              <Link href="/browse">Browse Campaigns</Link>
            </CustomButton>
          </div>
        </div>
      </section>
    </div>
  );
}
