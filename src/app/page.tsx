'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Text Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left order-1 lg:order-1">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Crowdfunding made transparent by{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary italic">Blockchain</span>
                <span className="absolute bottom-1 left-0 h-3 w-full bg-primary/20 -rotate-1 rounded-full -z-0" />
              </span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
              Launch your dreams on a decentralized platform where every contribution is verifiable and secure.
            </p>
          </div>

          {/* Image Content */}
          <div className="relative w-full max-w-2xl mx-auto order-2 lg:order-2 group">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              {/* The Image with "blurred edges" effect using a radial mask and soft overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none ring-1 ring-inset ring-black/5 rounded-3xl" />
              <Image
                src={heroImage?.imageUrl || '/crowfundng.png'}
                alt={heroImage?.description || 'Crowdfunding Hero'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  maskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                }}
                priority
                data-ai-hint={heroImage?.imageHint || 'crowdfunding banner'}
              />
              {/* Inner glow to enhance soft edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Background decorative elements to complement the blur */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
          </div>

        </div>
      </section>
    </main>
  );
}
