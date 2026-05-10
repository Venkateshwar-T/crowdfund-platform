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
      <section className="relative w-full pt-16 pb-12 md:pt-32 md:pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Circle className="h-2 w-2 fill-current" />
            The Mission
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 max-w-5xl">
            Power back to <br />
            <span className="text-primary italic pr-4">
              the creators.
            </span>
          </h1>
          <p className="text-base md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Traditional platforms take massive cuts and freeze funds. We built this to eliminate the middleman and replace them with open, immutable code.
          </p>
        </div>
        
        {/* Abstract Background Blurs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#78999D]/5 rounded-full blur-[100px]" />
      </section>

      {/* Bento Grid: Problem & Solution */}
      <section className="w-full py-6 md:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* The Problem */}
            <div className="md:col-span-5 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-white/50 backdrop-blur-md border border-border/50 flex flex-col gap-6 md:gap-8 relative overflow-hidden">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
                <AlertCircle className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">The Problem</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Web2 crowdfunding is broken. High fees, centralized censorship, and opaque payout schedules force creators to wait weeks for their own money while platforms take a 5-10% cut of every dream.
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="md:col-span-7 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-white/50 backdrop-blur-md border border-border/50 flex flex-col gap-6 md:gap-8 relative overflow-hidden group">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <CheckCircle2 className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">The Solution</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                  By using the Ethereum blockchain, we replace human intermediaries with a Smart Contract. It is transparent, permissionless, and impossible to shut down.
                </p>
              </div>
              <div className="absolute bottom-[-15%] right-[-10%] opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110 pointer-events-none">
                <ShieldCheck className="w-40 h-40 md:w-80 md:h-80 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Innovation: USD Hub */}
      <section className="w-full py-10 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 md:p-20 rounded-2xl md:rounded-[3.5rem] bg-white/40 backdrop-blur-xl border border-border/50 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78999D]/10 border border-[#78999D]/20 text-[#78999D] text-[10px] font-black uppercase tracking-[0.2em]">
                  Market Stability
                </div>
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none text-foreground">
                  The Innovation: <br />
                  <span className="text-[#1C9A9C]">The USD Hub</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                  Volatility is the enemy of progress. If you raise 10 ETH today, it might be worth 30% less by the time your campaign ends. 
                  <br /><br />
                  We fixed that. Using <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">Chainlink Price Oracles</span>, our platform tracks goals in USD while accepting payments in ETH.
                </p>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-[280px] md:max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[60px] md:blur-[100px]" />
                  <div className="relative z-10 w-full h-full rounded-2xl md:rounded-[3rem] bg-white/60 border border-border/50 backdrop-blur-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center gap-4 md:gap-8 shadow-2xl">
                    <TrendingUp className="h-12 w-12 md:h-20 md:w-20 text-[#9CC2C6]" />
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-3xl md:text-5xl font-black text-foreground">$5,000</div>
                      <div className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Target Value Locked</div>
                    </div>
                    <div className="w-full h-px bg-border/50" />
                    <div className="text-xs md:text-sm text-muted-foreground font-medium italic">"Price volatility is no longer your problem."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="w-full py-10 md:py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-16">
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Core Pillars</h2>
            <div className="h-1 w-16 md:h-1.5 md:w-24 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {CORE_PILLARS.map((pillar, i) => (
              <div key={i} className="p-8 md:p-10 rounded-2xl md:rounded-[3rem] bg-white/50 backdrop-blur-md border border-border/50 hover:border-primary/20 hover:bg-white transition-all duration-500 flex flex-col gap-6 md:gap-8 group shadow-sm">
                <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white border border-border flex items-center justify-center transition-transform duration-500 group-hover:scale-110", pillar.accent)}>
                  <pillar.icon className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Ribbon */}
      <section className="w-full py-10 md:py-20 px-6 border-y border-border/50 bg-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-around items-center gap-8 md:gap-12">
            {TECH_STACK.map((tech, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-6 group">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-500 shadow-sm">
                  <tech.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <div className="text-sm md:text-lg font-black text-foreground">{tech.name}</div>
                  <div className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 md:gap-12 relative z-10">
          <h2 className="text-3xl md:text-8xl font-black tracking-tighter leading-none text-foreground">
            Ready to build <br />
            <span className="text-primary italic">the future?</span>
          </h2>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <CustomButton asChild className="rounded-full px-8 md:px-12 h-12 md:h-16 text-sm md:text-lg font-black bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/fundraisers/new" className="flex items-center gap-2 md:gap-3">
                Launch Campaign <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="rounded-full px-8 md:px-12 h-12 md:h-16 text-sm md:text-lg font-black border-border bg-white/50 backdrop-blur-sm hover:bg-white text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm">
              <Link href="/browse">Browse Projects</Link>
            </CustomButton>
          </div>
        </div>
        
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
      </section>
    </div>
  );
}