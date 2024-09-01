'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import homeLogoSvg from '../../../public/assets/svgs/home/main-logo.svg';

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
            <Image width={150} src={homeLogoSvg} alt="Home Logo" />
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              © {new Date().getFullYear()} SparkMind. All rights reserved.
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/legal/privacy" className="text-navy hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-navy hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="text-navy hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}