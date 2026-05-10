'use client';

import { ShieldCheck, Eye, Coins, Globe } from 'lucide-react';

const ADVANTAGES = [
  {
    title: 'Full Transparency',
    description: 'Every donation is recorded on a public ledger. You can see exactly where the funds are going and how they are being used.',
    icon: Eye,
  },
  {
    title: 'Enhanced Security',
    description: 'Decentralized technology ensures that funds are safe from central points of failure and unauthorized tampering.',
    icon: ShieldCheck,
  },
  {
    title: 'Lower Fees',
    description: 'By removing traditional banking middlemen, more of your contribution goes directly to the cause you care about.',
    icon: Coins,
  },
  {
    title: 'Global Accessibility',
    description: 'Anyone, anywhere in the world can contribute or start a fundraiser without worrying about cross-border restrictions.',
    icon: Globe,
  },
];

export function WhyChooseUs() {
  return (
    <section className="w-full bg-primary/5 py-10 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 md:gap-4">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              The Blockchain Advantage
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              We leverage decentralized technology to solve the biggest trust issues in traditional crowdfunding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {ADVANTAGES.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow flex flex-col gap-3 md:gap-4"
                >
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}