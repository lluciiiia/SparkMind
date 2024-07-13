'use client';
import { ContentLayout } from '@/components/dashboard/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PiNoteBlankFill } from 'react-icons/pi';
import { NewNoteSection } from './new-note';

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <details open={isOpen} onToggle={handleToggle}>
          <summary
            className={`left-0 relative ${
              isOpen ? 'rounded-l-md' : 'rounded-md'
            } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${
              isOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />
            {isOpen && <span>New note</span>}
          </summary>
          <NewNoteSection />
        </details>
      </div>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative border-2 border-blue-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          <Drawer>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent className="w-[80%] mx-auto">
              <Tabs>
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <ScrollArea className="h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                    {[...Array(100)].map((_, i) => (
                      <div key={i} className="w-full h-[100px] bg-blue-400">
                        {i}
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="tab2">Tab 2</TabsContent>
              </Tabs>
            </DrawerContent>
          </Drawer>
        </section>
      </ContentLayout>
    </>
  );
};
