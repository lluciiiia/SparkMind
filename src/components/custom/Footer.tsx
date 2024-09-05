import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#003366] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <Link href="/">
              <span
                className={`text-white font-bold text-2xl flex items-center space-x-2 cursor-pointer`}
              >
                SparkMind
              </span>
            </Link>
            <p className="mt-4 text-sm text-white">Empowering learners with AI-driven education.</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/#about" className="text-white hover:text-[#0257AC] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#features"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="text-white hover:text-[#0257AC] transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4 text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#0257AC] transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#0257AC] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#0257AC] transition-colors">
                <FaLinkedinIn size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#0257AC] transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0 text-white">
            © {new Date().getFullYear()} SparkMind. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link href="/#faq" className="text-sm text-white hover:text-[#0257AC] transition-colors">
              FAQ
            </Link>
            <Link 
              href="/support" className="text-sm text-white hover:text-[#0257AC] transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
