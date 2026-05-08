'use client';

import { HeroSection } from '@/components/hero-section';
import { CategoryBubbles } from '@/components/category-bubbles';
import { WhyChooseUs } from '@/components/why-choose-us';
import { ScrollToTop } from '@/components/scroll-to-top';

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center">
      <HeroSection />
      <CategoryBubbles />
      <WhyChooseUs />
      <ScrollToTop />
    </main>
  );
}
