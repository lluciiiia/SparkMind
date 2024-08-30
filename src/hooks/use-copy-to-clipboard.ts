import copy from 'copy-to-clipboard';
import { useCallback, useState } from 'react';

const useCopyToClipBoard = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const copyToClipBoard = useCallback(async (text: string): Promise<void> => {
    if ('clipboard' in navigator) {
      try {
        const res = await navigator.clipboard.writeText(text);
        setCopied(true);
        return res;
      } catch (error) {
        throw new Error(`${error instanceof Error ? error.message : error}`);
      } finally {
        setTimeout(() => setCopied(false), 3000);
      }
    } else {
      copy(text);
    }
  }, []);
  return { copied, copyToClipBoard };
};

export { useCopyToClipBoard };
