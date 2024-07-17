'use client';
import { CenterLayout } from '@/components';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const NotFound = React.memo(() => {
  const router = useRouter();
  return (
    <CenterLayout
      Element={`main`}
      className={`
        w-screen h-screen flex items-center 
				justify-center
      `}
    >
      <article
        className={`
          my-20 z-10 relative text-center
          max-w-[300px] mx-auto
        `}
      >
        <h1
          className={`
            text-[#0257AC] text-[10rem] font-bold
          `}
        >
          404
        </h1>
        <h2
          className={`
            text-[#0257AC] text-[2rem] font-bold
          `}
        >
          Oh no, you've lost your way!
        </h2>
        <p
          className={`
            text-[#0257AC] text-[1.2rem]
          `}
        >
          Just like a marathon, coding can sometimes lead us off track. But don't worry, we're here
          to help you cross the finish line. Let's get you back to the starting block.
        </p>
        <Button className="bg-[#0257AC] text-white mt-4" onClick={() => router.push('/')}>
          Return to the starting line
        </Button>
      </article>
    </CenterLayout>
  );
});

export default NotFound;