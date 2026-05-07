
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl transition-all hover:shadow-primary/10">
        <Image
          src={heroImage?.imageUrl || '/crowfundng.png'}
          alt={heroImage?.description || 'Crowdfunding Hero'}
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
          priority
          data-ai-hint={heroImage?.imageHint || 'crowdfunding banner'}
        />
      </div>
    </main>
  );
}
