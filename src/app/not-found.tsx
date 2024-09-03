'use client';

import { CenterLayout } from '@/components';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const NotFound = () => {
  const router = useRouter();

  return (
    <CenterLayout
      Element={`main`}
      className={`
        h-[100dvh] w-[100dvw] bg-[#F0F0F0] flex flex-col justify-center items-center
      `}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <article className="text-center">
          <h1 className="text-[#0257AC] text-9xl font-bold mb-4">404</h1>
          <h2 className="text-[#0257AC] text-3xl font-bold mb-4">
            Oops! Study Session Interrupted
          </h2>
          <p className="text-[#0257AC] text-lg mb-8">
            It seems you've wandered into uncharted territory in SparkMind. The page you're looking
            for isn't part of our current curriculum. Let's get you back on track to continue your
            personalized learning journey with our AI-assisted study tools.
          </p>
          <Button
            className="bg-[#0257AC] text-white hover:bg-[#0257AC]/90 transition-colors duration-200"
            onClick={() => router.push('/')}
          >
            Return to Your Learning Hub
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </article>
      </div>
      <>
        <img
          src="/assets/images/auth.png"
          alt="SparkMind Logo"
          className="object-contain absolute inset-0 w-full h-full z-[-10] mx-auto my-auto max-w-[1440px] max-h-[900px] min-w-[1024px] min-h-[768px]"
          width={1440}
          height={900}
        />
      </>
    </CenterLayout>
  );
};

export default NotFound;
