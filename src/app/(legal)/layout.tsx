'use client';

import { Footer } from '@/components';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header
        className={`flex w-full justify-between px-4 md:px-16 lg:px-32 sticky top-0 left-0 right-0 bg-white shadow-md py-2 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-none'}`}
      >
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold">
            <Image 
              width={150} 
              height={50}
              src={`/assets/svgs/home/main-logo.svg`} alt="Home Logo" 
            />
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
