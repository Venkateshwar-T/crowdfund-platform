'use client';

import { cn } from '@/lib/utils';
import { CAMPAIGN_CATEGORIES } from '@/lib/constants';

export function CategoryBubbles() {
  return (
    <section className="w-full max-w-7xl px-4 py-16 mx-auto">
      <div className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Browse from variety of domains
          </h2>
          <p className="text-muted-foreground mt-2">
            Find fundraisers that resonate with your passions
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {CAMPAIGN_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={cn(
                  "group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1 active:scale-95",
                  "bg-white/50 backdrop-blur-sm",
                  category.color
                )}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm md:text-base whitespace-nowrap">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}