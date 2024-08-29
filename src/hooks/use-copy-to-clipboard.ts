import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

const useCopyToClipBoard = async (): Promise<
  { copied: boolean; copyToClipBoard: (text: string) => void }
> => {
  const [copied, setCopied] = useState<boolean>(false)
  const copyToClipBoard = useCallback( async (text: string) => {
    if ('clipboard' in navigator) {
      try {
        const res = await navigator.clipboard.writeText(text)
        setCopied(true)
        return res
      } catch (error) {
        throw new Error(`${error instanceof Error ? error.message : error}`)
      } finally {
        setTimeout(() => setCopied(false), 3000)
      }
    } else {
      copy(text)
    }
  }, [])
  return { copied, copyToClipBoard }
}

export { useCopyToClipBoard }