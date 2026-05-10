'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn(
      "fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-40 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-75 pointer-events-none"
    )}>
      <Button
        onClick={scrollToTop}
        className="h-8 px-3 md:h-10 md:px-6 rounded-full shadow-xl border border-primary/20 bg-background/90 backdrop-blur-md text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group flex items-center gap-2"
      >
        <ArrowUp className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:-translate-y-0.5" />
        <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest">Back to top</span>
      </Button>
    </div>
  );
}