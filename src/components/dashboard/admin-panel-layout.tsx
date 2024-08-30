'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMediaQuery, useIsomorphicLayoutEffect } from 'usehooks-ts';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLaptop = useMediaQuery('(max-width: 1023px)');
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const pathname = usePathname();
  const isBase = pathname === '/';

  useIsomorphicLayoutEffect(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    const shouldHideOverflow =
      !pathname.includes('signin') && !isBase && !pathname.includes('legal');
    body.style.overflowY = shouldHideOverflow ? 'hidden' : 'auto';
  }, [pathname]);

  if (!sidebar) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={cn(
          'flex-grow overflow-auto bg-zinc-50 dark:bg-zinc-900 transition-all ease-in-out duration-300',
          sidebar?.isOpen
            ? isLaptop
              ? 'w-[calc(100%-90px)]'
              : 'w-[calc(100%-288px)]'
            : 'w-[calc(100%-90px)]'
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}