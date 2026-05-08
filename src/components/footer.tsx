'use client';

import Link from 'next/link';
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialLinkedin } from "react-icons/sl";
import { type IconType } from "react-icons";
import { CustomButton } from './custom-button';
import { BrandLogo } from './brand-logo';

// Constants
const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
] as const;

interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaXTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: SlSocialLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

// Sub-components
interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base md:text-lg text-primary">{title}</h3>
      {children}
    </div>
  );
}

function FooterNavigation() {
  return (
    <nav className="flex flex-col gap-2">
      {FOOTER_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-4">
      {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="p-2 bg-accent rounded-full hover:bg-primary/20 transition-colors text-primary"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}

function BrandSection() {
  return (
    <div className="flex flex-col gap-4">
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
  );
}

function CTASection() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-6 md:p-8 rounded-3xl">
      <div className="text-center md:text-left">
        <h3 className="text-lg md:text-xl font-bold text-primary">Ready to change the world?</h3>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          Launch your dream fundraiser in minutes with blockchain security.
        </p>
      </div>
      <CustomButton asChild className="rounded-full px-8 h-10 md:h-12 text-base font-bold whitespace-nowrap w-full md:w-auto">
        <Link href="/fundraisers/new">Start a Fundraiser</Link>
      </CustomButton>
    </div>
  );
}

function Copyright() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
      <p>&copy; {currentYear} CrowdFund. All rights reserved.</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-10 pb-6">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <div className="lg:col-span-2">
            <BrandSection />
          </div>
          <FooterColumn title="Platform">
            <FooterNavigation />
          </FooterColumn>
          <FooterColumn title="Follow Us">
            <SocialLinks />
          </FooterColumn>
        </div>

        {/* CTA Section */}
        <div className="mb-8">
          <CTASection />
        </div>

        {/* Copyright */}
        <Copyright />
      </div>
    </footer>
  );
}
