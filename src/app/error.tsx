'use client';

import { Button } from '@/components/ui/button';
import { useLayoutEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useLayoutEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section
      className={`
			h-screen flex items-center justify-center
			w-screen
			`}
    >
      <article className="cardNoise ">
        <p
          className={`
					text-center text-2xl font-bold
					 mt-10
					`}
        >
          An error occurred. Please try again later.
        </p>
        <p
          className={`
					text-center text-lg
						mt-2
						`}
        >
          {error.message}
        </p>
        <Button
          className={`
					px-3 py-1
					text-center text-lg font-bold
					text-[#f3f5f7] mt-4
					border-2 border-[#34383a]
					rounded-md
					hover:text-white
					transition-colors w-full 
					`}
          onClick={reset}
        >
          Try Again
        </Button>
      </article>
    </section>
  );
}
