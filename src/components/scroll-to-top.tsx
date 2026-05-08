'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn(
      "fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-75 pointer-events-none"
    )}>
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-xl border-2 border-primary/20 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
      >
        <ArrowUp className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:-translate-y-1" />
        <span className="sr-only">Scroll to top</span>
      </Button>
    </div>
  );
}
