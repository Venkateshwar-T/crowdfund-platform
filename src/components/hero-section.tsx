'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CustomButton } from '@/components/custom-button';

export function HeroSection() {
  return (
    <section className="w-full max-w-7xl px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        {/* Text Content */}
        <div className="flex flex-col gap-8 text-center lg:text-left order-1">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Crowdfunding made transparent by{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary italic">Blockchain</span>
                <span className="absolute bottom-1 left-0 h-3 w-full bg-primary/20 -rotate-1 rounded-full -z-0" />
              </span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
              Be part of a community on a decentralized platform where every contribution is verifiable and secure.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <CustomButton 
              className="rounded-full px-6 h-10 text-base sm:px-10 sm:h-14 sm:text-lg font-bold"
            >
              Start a Fundraiser
            </CustomButton>
            
            <CustomButton 
              variant="outline"
              asChild
              className="rounded-full px-6 h-10 text-base sm:px-10 sm:h-14 sm:text-lg font-bold"
            >
              <Link href="/browse">Explore Campaigns</Link>
            </CustomButton>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative w-full max-w-2xl mx-auto order-2">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/crowdfunding.png"
              alt="Crowdfunding Hero"
              fill
              className="object-cover"
              style={{
                WebkitMaskImage: `
                  linear-gradient(to bottom, transparent, black 25%, black 80%, transparent),
                  linear-gradient(to right, transparent, black 30%, black 70%, transparent)
                `,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
              priority
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
