"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/dashboard/footer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "w-full min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
    </>
  );
}
