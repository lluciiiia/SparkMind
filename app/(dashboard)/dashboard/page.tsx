"use client"
import Link from 'next/link';
import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiNoteBlankFill } from 'react-icons/pi';

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(event.currentTarget.open);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <details open={isOpen} onToggle={handleToggle}>
          <summary
            className={`left-0 relative ${isOpen ? 'rounded-l-md' : 'rounded-md'
              } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${isOpen ? 'justify-start' : 'justify-center'
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
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaCaretLeft, FaCaretRight, FaPlus } from 'react-icons/fa';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const NewNoteSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-items-start rounded-bl-md rounded-r-none w-[calc(100vw-100px)] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] pt-5">
      <Button className="bg-transparent border-dashed border-2 border-blue-500 rounded-r-md rounded-bl-md w-[75px] h-[75px] mr-auto">
        <FaPlus size={24} color="#60a5fa" />
      </Button>
      <ScrollArea className="w-full h-[calc(100vh-199px)] pt-5">
        <section className="flex flex-col items-start justify-start gap-10">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] bg-blue-400 rounded-r-3xl rounded-bl-3xl"
            >
              {i}
            </div>
          ))}
        </section>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
