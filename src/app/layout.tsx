import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { Web3Provider } from '@/components/shared/web3-provider';

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
        <Web3Provider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <BottomNav />
            <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}