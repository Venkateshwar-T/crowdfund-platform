'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/shared/custom-button';

export function FloatingCTA({ onContribute, visible }: { onContribute: () => void, visible: boolean }) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-in-out md:left-1/2 md:-translate-x-1/2 md:max-w-4xl md:px-0",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none",
        "md:bottom-8",
        isNavVisible ? "bottom-[calc(4rem+1rem)]" : "bottom-4"
      )}
    >
      <div className="p-3 md:p-4 bg-foreground/90 backdrop-blur-xl rounded-2xl md:rounded-3xl text-white flex items-center justify-between gap-4 shadow-2xl ring-1 ring-white/10">
        <div className="pl-2">
          <p className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-widest">Drive Impact</p>
          <p className="text-xs md:text-sm font-bold">Help this cause</p>
        </div>
        <CustomButton 
          onClick={onContribute}
          className="h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
        >
          Contribute Now
        </CustomButton>
      </div>
    </div>
  );
}