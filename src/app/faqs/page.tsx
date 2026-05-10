'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, CreditCard, RefreshCw, User } from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Blockchain & Security",
    icon: Shield,
    items: [
      {
        q: "Why do I need a crypto wallet?",
        a: "The platform doesn't use traditional bank accounts. Your wallet (MetaMask, Coinbase Wallet, etc.) is your ID and your vault. It allows you to interact directly with the smart contract without a middleman."
      },
      {
        q: "Can the platform owner steal my money?",
        a: "No. Your funds are held by a decentralized Smart Contract, not our company bank account. The code dictates that funds can only be released to the creator if the goal is met. If it fails, the contract allows you to pull your money back."
      },
      {
        q: "How do I know the campaign is real?",
        a: "Every transaction is recorded on the public blockchain. You can verify the creator's address and the contract’s balance on Etherscan at any time. However, blockchain transparency doesn't stop people from lying; always do your own research on the person behind the project."
      }
    ]
  },
  {
    title: "Payments & Volatility",
    icon: CreditCard,
    items: [
      {
        q: "Why is the goal in USD if I’m paying in ETH?",
        a: "Crypto prices are volatile. To protect creators from a market crash, we use a USD Hub strategy. Our smart contract uses a Chainlink Oracle to check the real-time exchange rate the moment you donate, ensuring the fundraiser hits a stable value target."
      },
      {
        q: "What is a 'Gas Fee'?",
        a: "Gas is the transaction fee paid to the Ethereum network (miners/validators) to process your donation. This fee does not go to the campaign creator or this platform. It varies based on how busy the network is."
      },
      {
        q: "Why hasn't my donation appeared yet?",
        a: "Blockchain transactions require network confirmation. Depending on network traffic, it can take anywhere from 15 seconds to a few minutes for the 'block' containing your transaction to be finalized."
      }
    ]
  },
  {
    title: "Refunds & Goals",
    icon: RefreshCw,
    items: [
      {
        q: "What happens if the goal isn't met?",
        a: "If a campaign reaches its deadline without hitting the USD target, the funds become 'refundable.' You must return to the campaign page and click 'Claim Refund' to trigger the smart contract to send your ETH back to your wallet."
      },
      {
        q: "Can I cancel my donation?",
        a: "No. Transactions on the blockchain are immutable. Once you send, the transaction is confirmed, it cannot be reversed unless the campaign fails to meet its goal and enters the refund phase."
      },
      {
        q: "Can the creator withdraw funds early?",
        a: "Absolutely not. The smart contract strictly enforces the deadline and the target goal. The 'Withdraw' function remains locked until the blockchain confirms the target has been reached."
      }
    ]
  },
  {
    title: "Profile & Privacy",
    icon: User,
    items: [
      {
        q: "Is my name stored on the blockchain?",
        a: "No. Your display name is stored off-chain to save you money on gas fees. Only your wallet address and your transaction history are permanently etched into the blockchain."
      },
      {
        q: "Can I change my wallet address?",
        a: "Your profile is tied to your specific wallet address. If you switch wallets, you will appear as a completely new user. You cannot 'transfer' a profile to a new address."
      }
    ]
  }
];

export default function FAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="w-full bg-primary/5 py-10 md:py-16 px-6 md:px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mx-auto">
            <HelpCircle className="h-3.5 w-3.5" />
            Support Center
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-[0.9] text-foreground">
            Your Questions, <span className="text-primary italic">Answered</span>.
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about decentralized fundraising and blockchain security.
          </p>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[120px]" />
      </section>

      {/* FAQ Content */}
      <section className="w-full py-10 md:py-16 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 md:gap-12">
          {FAQ_SECTIONS.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b pb-3 border-border/50">
                <div className="p-2 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl text-primary">
                  <section.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                  {section.title}
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {section.items.map((item, itemIdx) => (
                  <AccordionItem 
                    key={itemIdx} 
                    value={`item-${idx}-${itemIdx}`}
                    className="border border-border/50 rounded-xl md:rounded-2xl bg-white/50 px-4 md:px-6 hover:bg-white transition-colors overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-xs md:text-base font-bold text-left hover:no-underline py-3 md:py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-[11px] md:text-sm leading-relaxed pb-4 md:pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Simple CTA */}
      <section className="w-full py-12 md:py-16 px-6 bg-foreground text-white">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6 md:gap-8">
          <h2 className="text-2xl md:text-4xl font-black">Still have questions?</h2>
          <p className="text-sm md:text-base text-white/60">
            We're here to help you navigate the future of crowdfunding. Reach out to our community for support.
          </p>
          <div className="flex justify-center">
            <a 
              href="mailto:support@crowdfund.io" 
              className="px-8 py-2.5 md:py-3 bg-primary text-white font-black text-xs md:text-sm rounded-full hover:bg-primary/90 transition-all active:scale-95"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
