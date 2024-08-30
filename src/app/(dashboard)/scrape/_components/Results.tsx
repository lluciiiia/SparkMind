'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { OutputSchema } from '@/schema/scrape';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { All, Recent } from '.';

export const Results = ({
  query,
  page,
  recent,
  all,
}: {
  query: string;
  page: string;
  recent: OutputSchema[];
  all: OutputSchema[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'recent';

  const setTab = (newTab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', newTab);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <Tabs value={tab}>
      <TabsList>
        <TabsTrigger value="recent" onClick={() => setTab('recent')}>
          Recent
        </TabsTrigger>
        <TabsTrigger value="all" onClick={() => setTab('all')}>
          All
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recent">
        <ScrollArea>
          <Recent recent={recent} />
          <ScrollBar orientation={`vertical`} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="all">
        <ScrollArea>
          <All query={query} page={Number.parseInt(page)} all={all} />
          <ScrollBar orientation={`vertical`} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
