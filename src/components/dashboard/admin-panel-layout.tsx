'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLaptop = useMediaQuery('(max-width: 1023px)'); 
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
          sidebar?.isOpen === false
            ? isLaptop
              ? 'w-[calc(100%)] lg:ml-[90px]'
              : 'w-[calc(100%-4rem)] lg:ml-[90px]'
            : isLaptop
            ? 'w-[calc(100%-90px)] lg:ml-[90px]'
            : 'w-[calc(100%-18rem)] lg:ml-72',
        )}
      >
        {children}
      </main>
    </>
  );
}