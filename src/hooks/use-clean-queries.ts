import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export const useCleanQueries = (expectedQueries: string[]): (() => void) => {
  const router = useRouter();

  const cleanQueries = useCallback(() => {
    const url = new URL(window.location.href);
    expectedQueries.forEach((query) => url.searchParams.set(query, query));
    router.replace(url.toString());
  }, [router, expectedQueries]);

  useIsomorphicLayoutEffect(() => {
    cleanQueries();
  }, [cleanQueries]);

  return cleanQueries;
};
