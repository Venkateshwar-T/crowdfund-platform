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
  TrendingUp
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
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Mission
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 max-w-4xl">
            Putting control back <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#78999D] to-[#9CC2C6] italic">
              where it belongs.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
            Traditional platforms take massive cuts and freeze funds. We built this to eliminate the middleman and replace them with open, immutable code.
          </p>
        </div>
        
        {/* Abstract Background Blur */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </section>

      {/* Bento Grid: Problem & Solution */}
      <section className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* The Problem */}
            <div className="md:col-span-5 p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex flex-col gap-6 relative overflow-hidden group">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black">The Problem</h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Web2 crowdfunding is broken. High fees, centralized censorship, and opaque payout schedules force creators to wait weeks for their own money while platforms take a 5-10% cut of every dream.
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="md:col-span-7 p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex flex-col gap-6 relative overflow-hidden group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black">The Solution</h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  By using the Ethereum blockchain, we replace human intermediaries with a Smart Contract. It is transparent, permissionless, and impossible to shut down. Your data stays on the permanent web, and your funds are protected by code.
                </p>
              </div>
              <div className="absolute bottom-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <ShieldCheck className="w-64 h-64 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Innovation: USD Hub */}
      <section className="w-full py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 md:p-16 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78999D]/10 border border-[#78999D]/20 text-[#78999D] text-xs font-black uppercase tracking-widest">
                  Market Stability
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                  The Innovation: <br />
                  <span className="text-[#9CC2C6]">The USD Hub</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  Volatility is the enemy of progress. If you raise 10 ETH today, it might be worth 30% less by the time your campaign ends. 
                  <br /><br />
                  We fixed that. Using <span className="text-white font-bold">Chainlink Price Oracles</span>, our platform tracks goals in USD while accepting payments in ETH. This ensures you get exactly the value you need, regardless of market swings.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px]" />
                  <div className="relative z-10 w-full h-full rounded-[2.5rem] bg-zinc-800/50 border border-zinc-700 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center gap-6">
                    <TrendingUp className="h-16 w-16 text-[#9CC2C6]" />
                    <div className="space-y-2">
                      <div className="text-3xl font-black text-white">$5,000</div>
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Guaranteed Value</div>
                    </div>
                    <div className="w-full h-px bg-zinc-700" />
                    <div className="text-sm text-zinc-400 italic">"Price volatility is no longer your problem."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="w-full py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight">Core Pillars</h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_PILLARS.map((pillar, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col gap-6">
                <pillar.icon className={cn("h-8 w-8", pillar.accent)} />
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{pillar.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Highlight */}
      <section className="w-full py-12 px-6 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            {TECH_STACK.map((tech, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                  <tech.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-zinc-300">{tech.name}</div>
                  <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-10 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Ready to build <br />
            <span className="text-[#9CC2C6]">the future?</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <CustomButton asChild className="rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-lg font-black bg-primary hover:bg-primary/90 text-white border-0">
              <Link href="/fundraisers/new" className="flex items-center gap-2">
                Launch Campaign <ArrowRight className="h-5 w-5" />
              </Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-lg font-black border-zinc-800 hover:bg-zinc-900 text-zinc-300">
              <Link href="/browse">Browse Campaigns</Link>
            </CustomButton>
          </div>
        </div>
        
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
      </section>
    </div>
  );
}
