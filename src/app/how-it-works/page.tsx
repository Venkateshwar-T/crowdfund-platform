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
    description: "Supporters donate ETH. Our contract utilize a Chainlink Price Oracle to check the current market price and record the value in USD immediately.",
    tech: "The Oracle acts as a bridge, ensuring the fundraiser's progress is accurate regardless of ETH price fluctuations.",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 border-amber-200"
  },
  {
    number: "04",
    title: "Campaign Status & Badges",
    description: "Every campaign moves through three automated stages based on time and funding. This is enforced by code, not humans.",
    list: [
      { label: "NEW", desc: "First 10 days to gain initial momentum." },
      { label: "ACTIVE", desc: "Established and open for contributions." },
      { label: "COMPLETED", desc: "Reached successfully." }
    ],
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
  },
  {
    number: "05",
    title: "The Outcome: Withdrawal",
    description: "Our smart contract acts as a neutral escrow. If your campaign reaches its USD target, you can trigger a Withdrawal.",
    security: "The contract releases the collected ETH directly to your wallet. If a goal isn't met, the funds remain protected by the contract's logic.",
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="w-full bg-primary/5 py-6 md:py-10 px-6 md:px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-2 md:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-xs font-black uppercase tracking-widest mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
            <Lock className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Blockchain Infrastructure
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-[0.9] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            How it <span className="text-primary italic">Actually</span> Works.
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-300">
            Transparent. Decentalized. Brutally honest. We don't hold your money—the smart contract does.
          </p>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[120px]" />
      </section>

      {/* Technical Highlights */}
      <section className="w-full py-4 md:py-8 px-6 md:px-4 border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <div className="p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-foreground text-white flex flex-col gap-3 relative overflow-hidden group">
            <Server className="h-10 w-10 text-primary opacity-50 absolute -right-2 -top-2 scale-150 group-hover:scale-[2] transition-transform duration-700" />
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Globe className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="space-y-1 md:space-y-3">
              <h2 className="text-lg md:text-2xl font-black">IPFS Storage Layer</h2>
              <p className="text-white/60 leading-relaxed text-[11px] md:text-sm">
                Your media is decentralized and permanent. Not stored on our servers, but on the planet's hard drive via IPFS.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-white border border-border shadow-sm flex flex-col gap-3 relative overflow-hidden group">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="space-y-1 md:space-y-3">
              <h2 className="text-lg md:text-2xl font-black">Chainlink Oracles</h2>
              <p className="text-muted-foreground leading-relaxed text-[11px] md:text-sm">
                Crypto is volatile; your goal shouldn't be. We use Chainlink price feeds to bridge real-world USD value with ETH.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Workflow */}
      <section className="w-full py-6 md:py-12 px-6 md:px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">The Blockchain Workflow</h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Follow the journey from wallet connection to fund withdrawal.</p>
          </div>

          <div className="flex flex-col gap-8 md:gap-16">
            {STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className={cn(
                  "flex flex-col md:flex-row gap-4 md:gap-12 items-start group",
                  index % 2 !== 0 && "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-3 md:space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </span>
                    <div className={cn("p-2.5 md:p-3.5 rounded-xl md:rounded-2xl border flex items-center justify-center", step.color)}>
                      <step.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-lg md:text-2xl font-black tracking-tight">{step.title}</h3>
                    <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                      <p className="text-[11px] md:text-sm">{step.description}</p>
                      
                      {step.list && (
                        <div className="grid grid-cols-1 gap-1.5 mt-3">
                          {step.list.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm",
                                item.label === "NEW" && "bg-blue-500/80 text-white",
                                item.label === "ACTIVE" && "bg-white/80 text-primary border-primary/20",
                                item.label === "COMPLETED" && "bg-green-500/80 text-white"
                              )}>
                                {item.label}
                              </span>
                              <span className="text-[10px] md:text-xs font-medium text-foreground">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(step.security || step.tech) && (
                        <div className="mt-3 p-3 md:p-4 bg-muted/50 rounded-xl md:rounded-[1.5rem] border-l-4 border-primary italic text-[10px] md:text-xs">
                          {step.security || step.tech}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center">
                   <div className="w-full max-w-[280px] aspect-square rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <step.icon className="h-24 w-24 text-primary/20 group-hover:scale-110 group-hover:text-primary transition-all duration-700" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-10 md:py-16 px-6 md:px-4 bg-foreground text-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-4 md:gap-8">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter">Ready to interact with the ledger?</h2>
          <p className="text-xs md:text-base text-white/60 max-w-xl mx-auto">
            Your journey is protected by code. Launch your first campaign or support a cause you believe in.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <CustomButton asChild className="rounded-full px-6 md:px-8 h-10 md:h-12 text-xs md:text-base font-black bg-primary hover:bg-primary/90">
              <Link href="/fundraisers/new" className="flex items-center gap-2">
                Launch Campaign <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="rounded-full px-6 md:px-8 h-10 md:h-12 text-xs md:text-base font-black border-white/20 hover:bg-white/10 text-white">
              <Link href="/browse">Browse Campaigns</Link>
            </CustomButton>
          </div>
        </div>
      </section>
    </div>
  );
}
