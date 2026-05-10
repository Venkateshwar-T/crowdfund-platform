'use client';

import { HeroSection } from '@/components/HomePage/hero-section';
import { WhyChooseUs } from '@/components/HomePage/why-choose-us';
import { CategoryBubbles } from '@/components/HomePage/category-bubbles';
import { ScrollToTop } from '@/components/HomePage/scroll-to-top';

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