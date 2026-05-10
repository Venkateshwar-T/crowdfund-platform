'use client';

import { 
  Wallet, 
  UploadCloud, 
  Zap, 
  ShieldCheck, 
  RefreshCcw, 
  BarChart3,
  Server,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CustomButton } from '@/components/custom-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    number: "01",
    title: "Connect Your Web3 Wallet",
    description: "The platform is powered by the Ethereum blockchain (Sepolia Testnet). To interact with any feature, users must connect a compatible Web3 wallet. This serves as your digital identity—no passwords or traditional accounts are required.",
    security: "Your wallet address is used to track your campaigns and contributions securely on-chain.",
    icon: Wallet,
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  {
    number: "02",
    title: "Launch a Campaign",
    description: "When you create a fundraiser, your data is split into two secure layers: Media is stored on IPFS (InterPlanetary File System) for decentralization, while core data (Title, Goal, Deadline) is written directly into our Smart Contract.",
    tech: "IPFS ensures your campaign media is permanent and not stored on a centralized server that can go down.",
    icon: UploadCloud,
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  },
  {
    number: "03",
    title: "Contributing with Confidence",
    description: "Supporters donate ETH. Our contract utilizes a Chainlink Price Oracle to check the current market price and record the value in USD immediately.",
    tech: "The Oracle acts as a bridge, ensuring the fundraiser's progress is accurate regardless of ETH price fluctuations.",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 border-amber-200"
  },
  {
    number: "04",
    title: "Campaign Status & Badges",
    description: "Every campaign moves through three automated stages based on time and funding. This is enforced by code, not humans.",
    list: [
      { label: "ACTIVE", desc: "The campaign is live and currently accepting contributions." },
      { label: "SUCCESSFUL", desc: "The USD target was reached before the deadline." },
      { label: "FAILED", desc: "The deadline passed without hitting the funding target." }
    ],
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
  },
  {
    number: "05",
    title: "The Outcome: Withdrawal",
    description: "Our smart contract acts as a neutral escrow. If your campaign reaches its USD target, you can trigger a Withdrawal.",
    security: "The contract releases the collected ETH directly to your wallet. If a goal isn't met, the funds remain protected by the contract's logic for refunds.",
    icon: RefreshCcw,
    color: "bg-rose-500/10 text-rose-600 border-rose-200"
  },
  {
    number: "06",
    title: "Your Personal Dashboard",
    description: "Track your entire history through the Profile Page. No spreadsheets needed—it's all pulled directly from the ledger.",
    icon: BarChart3,
    color: "bg-slate-500/10 text-slate-600 border-slate-200"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground selection:bg-primary/30">
      {/* Hero Header */}
      <section className="w-full pt-10 pb-8 md:pt-20 md:pb-12 px-6 md:px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest mx-auto">
            <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Blockchain Infrastructure
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-[0.9] text-foreground">
            How it <span className="text-primary italic">Actually</span> Works.
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Transparent. Decentalized. Brutally honest. We don't hold your money—the smart contract does.
          </p>
        </div>
        
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[140px]" />
      </section>

      {/* Technical Highlights */}
      <section className="w-full py-10 md:py-16 px-6 md:px-4 border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="p-8 md:p-12 rounded-2xl md:rounded-[2.5rem] bg-foreground text-white flex flex-col gap-4 md:gap-6 relative overflow-hidden group">
            <Server className="h-12 w-12 text-primary opacity-50 absolute -right-4 -top-4 scale-150 group-hover:scale-[2] transition-transform duration-700" />
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Globe className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-3xl font-black">IPFS Storage Layer</h2>
              <p className="text-white/60 leading-relaxed text-xs md:text-base">
                Your media is decentralized and permanent. Not stored on our servers, but on the planet's hard drive via IPFS.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-2xl md:rounded-[2.5rem] bg-white border border-border shadow-sm flex flex-col gap-4 md:gap-6 relative overflow-hidden group">
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-3xl font-black">Chainlink Oracles</h2>
              <p className="text-muted-foreground leading-relaxed text-xs md:text-base">
                Crypto is volatile; your goal shouldn't be. We use Chainlink price feeds to bridge real-world USD value with ETH.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Workflow */}
      <section className="w-full py-12 md:py-20 px-6 md:px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-10 md:gap-16">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">The Blockchain Workflow</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-lg">Follow the journey from wallet connection to fund withdrawal.</p>
          </div>

          <div className="flex flex-col gap-12 md:gap-20">
            {STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className={cn(
                  "flex flex-col md:flex-row gap-8 md:gap-16 items-start group",
                  index % 2 !== 0 && "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-4 md:space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl md:text-7xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </span>
                    <div className={cn("p-3 md:p-4 rounded-xl md:rounded-[2rem] border flex items-center justify-center", step.color)}>
                      <step.icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-3xl font-black tracking-tight">{step.title}</h3>
                    <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                      <p className="text-[12px] md:text-base">{step.description}</p>
                      
                      {step.list && (
                        <div className="grid grid-cols-1 gap-2 mt-4">
                          {step.list.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm",
                                item.label === "ACTIVE" && "bg-white/80 text-primary border-primary/20",
                                item.label === "SUCCESSFUL" && "bg-green-500/80 text-white",
                                item.label === "FAILED" && "bg-red-500/80 text-white"
                              )}>
                                {item.label}
                              </span>
                              <span className="text-[11px] md:text-sm font-medium text-foreground">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(step.security || step.tech) && (
                        <div className="mt-4 p-4 md:p-6 bg-muted/50 rounded-2xl md:rounded-[2rem] border-l-4 border-primary italic text-[11px] md:text-sm">
                          {step.security || step.tech}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center">
                   <div className="w-full max-w-[300px] aspect-square rounded-[3rem] bg-primary/5 border border-primary/10 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <step.icon className="h-24 w-24 text-primary/20 group-hover:scale-110 group-hover:text-primary transition-all duration-700" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Matches FAQ style */}
      <section className="w-full py-16 md:py-24 px-6 bg-foreground text-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 md:gap-12 relative z-10">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none">
            Ready to interact <br />
            <span className="text-primary italic">with the ledger?</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <CustomButton asChild className="rounded-full px-8 md:px-12 h-12 md:h-16 text-sm md:text-lg font-black bg-primary hover:bg-primary/90 text-white border-0 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/fundraisers/new" className="flex items-center gap-2">
                Launch Campaign <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="rounded-full px-8 md:px-12 h-12 md:h-16 text-sm md:text-lg font-black border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              <Link href="/browse">Browse Campaigns</Link>
            </CustomButton>
          </div>
        </div>
      </section>
    </div>
  );
}
