'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { CustomButton } from './custom-button';
import { BrandLogo } from './brand-logo';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        {/* Top Row: Brand, Platform, and Socials */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column - Wider on desktop */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <BrandLogo />
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Backed By Blockchain
              </p>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Empowering dreams through secure and transparent decentralized funding.
              </p>
            </div>
          </div>

          {/* Platform Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-primary">Platform</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link>
            </nav>
          </div>

          {/* Social Links Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-primary">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row: Get Started CTA */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-8 rounded-3xl">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-primary">Ready to change the world?</h3>
              <p className="text-sm text-muted-foreground">Launch your dream fundraiser in minutes with blockchain security.</p>
            </div>
            <CustomButton className="rounded-full px-8 h-12 text-base font-bold w-full md:w-auto">
              Start a Fundraiser
            </CustomButton>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CrowdFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}