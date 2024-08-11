'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchRecentScrapes } from '@/lib/scrape';
import { type OutputSchema, inputSchema, outputSchema, scrapeSchema } from '@/schema/scrape';
import { useQueryState } from 'nuqs';
import React from 'react';
import { All, Recent, Scraper } from '.';

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
  const [tab, setTab] = useQueryState('tab', {
    parse: String,
    defaultValue: 'new',
    history: 'push',
    shallow: true,
  });
  return (
    <Tabs value={tab}>
      <TabsList>
        <TabsTrigger value="new" onClick={() => setTab('new')}>
          New
        </TabsTrigger>
        <TabsTrigger value="recent" onClick={() => setTab('recent')}>
          Recent
        </TabsTrigger>
        <TabsTrigger value="all" onClick={() => setTab('all')}>
          All
        </TabsTrigger>
      </TabsList>
      <TabsContent value="new">
        <>
          <Scraper />
          <></>
        </>
      </TabsContent>
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
