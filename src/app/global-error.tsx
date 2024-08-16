'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as Sentry from '@sentry/nextjs';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useIsomorphicLayoutEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section
      className={`
			h-screen flex items-center justify-center
			w-screen
			`}
    >
      <Card className="">
        <p
          className={`
					text-center text-2xl font-bold
					text-[#0257AC] mt-10
					`}
        >
          An error occurred. Please try again later.
        </p>
        <p
          className={`
					text-center text-lg
						text-[#0257AC] mt-2
						`}
        >
          {error instanceof Error ? `${error.message}\n${error.stack}` : null}
        </p>
        <Button
          className={`
					px-3 py-1
					text-center text-lg font-bold
					text-[#0257AC] mt-4
					border-2 border-[#0257AC]
					rounded-md
					hover:bg-[#0257AC] hover:text-white
					transition-colors w-full 
					`}
          onClick={reset}
        >
          Try Again
        </Button>
      </Card>
    </section>
  );
}
