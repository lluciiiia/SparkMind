'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeNavigation } from './HomeNavigation';
import { Footer } from '@/components';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <main
        className={`
          bg-white flex flex-col container w-screen
        `}
      >
        <div
          className={`
            flex w-full justify-between px-4 md:px-16 lg:px-32 fixed top-0 left-0 right-0 bg-white z-10 shadow-md items-center
          `}
        >
          <Link href="/" className="text-2xl font-bold">
            <img width={150} src="/assets/svgs/home/main-logo.svg" alt="Home Logo" />
          </Link>
          <HomeNavigation />
        </div>
        {/* Content below the navbar */}
        <div
          className={`
            pt-24 mb-4 flex flex-col space-y-10
          `}
        >
          <div
            className={`
              flex justify-center items-center w-full
            `}
          >
            <span
              className={`
                font-extrabold text-center
              `}
            >
              AI-driven learning hub platform
            </span>
          </div>
          <div
            className={`
              flex gap-4 w-full items-center justify-center ml-[-6%]
            `}
          >
            <img
              className={`
                w-[10%] h-auto
              `}
              src="/assets/images/home/features1.png"
              alt="Arrow "
            />
            <img
              className={`
                w-[50%] h-auto
              `}
              src="/assets/images/home/title 02.png"
              alt="Home Logo"
            />
          </div>
          <div
            className={`
              flex justify-center w-full
            `}
          >
            <Button
              onClick={() => {
                router.push('/my-learning');
              }}
              className={`
                bg-navy rounded-3xl text-white py-3 px-8
              `}
            >
              Get Started
            </Button>
          </div>
          <div
            className={`
              flex justify-center
            `}
          >
            <img
              className={`
                w-[80%] h-auto
              `}
              src="/assets/images/home/feature-03.png"
              alt="Three Dots "
            />
          </div>
          <div
            className={`
              flex flex-wrap justify-center w-full mb-4 gap-4 md:gap-8 lg:gap-24
            `}
          >
            <img
              className={`
                w-[24%] h-auto
              `}
              src="/assets/images/home/home-feat-1.png"
              alt="Home Feature 1"
            />
            <img
              className={`
                w-[24%] h-auto
              `}
              src="/assets/images/home/home-feat-2.png"
              alt="Home Feature 2"
            />
            <img
              className={`
                w-[24%] h-auto
              `}
              src="/assets/images/home/home-feat-3.png"
              alt="Home Feature 3"
            />
          </div>
        </div>
        <img
          className={`
            w-full h-auto mb-4
          `}
          src="/assets/images/feature/feature_frame.png"
          alt="Home Title"
        />
      </main>
      <Footer />
    </>
  );
}
