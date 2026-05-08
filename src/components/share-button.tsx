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
      name: 'WhatsApp',
      icon: <MessageCircle size={20} className="text-emerald-500 md:w-6 md:h-6" />, 
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'X',
      icon: <Twitter size={20} className="text-slate-900 md:w-6 md:h-6" />, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'Facebook',
      icon: <Facebook size={20} className="text-blue-600 md:w-6 md:h-6" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'Instagram',
      icon: <Instagram size={20} className="text-pink-600 md:w-6 md:h-6" />, 
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
            <div className="flex flex-col items-center gap-8">
              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Share Link</h2>
              
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 w-full px-2">
                {shareOptions.map((option, i) => (
                  <a
                    key={i}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group/item"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-muted/50 group-hover/item:bg-accent transition-all active:scale-90">
                      {option.icon}
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                      {option.name}
                    </span>
                  </a>
                ))}
                
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 group/item"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-muted/50 group-hover/item:bg-accent transition-all active:scale-90 text-muted-foreground group-hover/item:text-primary">
                    {copied ? <Check size={20} className="text-emerald-500 md:w-6 md:h-6" /> : <Copy size={20} className="md:w-6 md:h-6" />}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                    {copied ? 'Copied' : 'Copy Link'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
