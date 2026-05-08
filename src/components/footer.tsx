'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { CustomButton } from './custom-button';
import { BrandLogo } from './brand-logo';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-2">
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

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Platform</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* CTA Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Get Started</h3>
            <CustomButton className="rounded-full w-full lg:w-auto">
              Start a Fundraiser
            </CustomButton>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CrowdFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
