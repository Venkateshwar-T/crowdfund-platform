'use client';

import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Set URL on client side to avoid hydration mismatch
    setShareUrl(window.location.href);
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const shareOptions = [
    { 
      icon: <MessageCircle size={24} className="text-emerald-500" />, 
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` 
    },
    { 
      icon: <Twitter size={24} className="text-slate-900" />, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      icon: <Facebook size={24} className="text-blue-600" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` 
    },
    { 
      icon: <Instagram size={24} className="text-pink-600" />, 
      url: `https://instagram.com` 
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textField = document.createElement('textarea');
      textField.innerText = shareUrl;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-border rounded-full shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-90 group"
      >
        <Share2 size={20} className="text-muted-foreground group-hover:text-primary transition-colors md:w-6 md:h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="relative bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-w-sm w-full">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Share Link</h2>
              
              <div className="flex gap-2 md:gap-4 items-center">
                {shareOptions.map((option, i) => (
                  <a
                    key={i}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl hover:bg-muted transition-all active:scale-90"
                  >
                    {option.icon}
                  </a>
                ))}
                
                <div className="w-[1px] h-8 bg-border mx-1" />

                <button
                  onClick={copyToClipboard}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl hover:bg-muted transition-all active:scale-90 text-muted-foreground hover:text-primary"
                >
                  {copied ? <Check size={20} className="text-emerald-500 md:w-6 md:h-6" /> : <Copy size={20} className="md:w-6 md:h-6" />}
                </button>
              </div>

              {copied && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20">
                  <p className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                    Copied to clipboard
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
