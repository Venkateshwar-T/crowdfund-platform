'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FALLBACK_IMAGE } from '@/lib/constants';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from '@/components/ui/skeleton';

export function MediaGallery({ media, title }: { media: string[]; title: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = media.length > 0 ? media : [FALLBACK_IMAGE];

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-muted aspect-video shadow-lg">
      <Carousel setApi={setApi} className="w-full h-full" opts={{ align: "start", loop: true }}>
        <CarouselContent className="ml-0 h-full">
          {images.map((url, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              {!loadedImages[index] && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
              )}
              <div className="relative w-full h-full min-h-[200px] md:min-h-[400px]">
                <Image
                  src={url}
                  alt={`${title} media ${index}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  onLoad={() => handleImageLoad(index)}
                  data-ai-hint="campaign detail media"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === index ? 'w-4 bg-white' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
