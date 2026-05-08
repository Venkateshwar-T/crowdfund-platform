
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { MobileJoinBanner } from '@/components/mobile-join-banner';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'CrowdFund | Launch Your Dreams',
  description: 'A modern decentralized crowdfunding platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        <MobileJoinBanner />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
