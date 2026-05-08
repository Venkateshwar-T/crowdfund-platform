'use client';

import { Heart, Leaf, GraduationCap, Cat, Palette, Cpu, Trophy, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'medical', label: 'Medical', icon: Heart, color: 'bg-red-500/10 text-red-600 border-red-200' },
  { id: 'environment', label: 'Environment', icon: Leaf, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { id: 'animals', label: 'Animals', icon: Cat, color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  { id: 'arts', label: 'Arts and Media', icon: Palette, color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { id: 'technology', label: 'Technology', icon: Cpu, color: 'bg-slate-500/10 text-slate-600 border-slate-200' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  { id: 'disaster', label: 'Disaster Relief', icon: ShieldAlert, color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
];

export function CategoryBubbles() {
  return (
    <section className="w-full max-w-7xl px-4 py-16 mx-auto">
      <div className="flex flex-col gap-10">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Browse from variety of domains
          </h2>
          <p className="text-muted-foreground mt-2">
            Find fundraisers that resonate with your passions
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {CATEGORIES.map((category) => {
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
