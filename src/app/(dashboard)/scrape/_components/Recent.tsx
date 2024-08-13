'use client';

import { Slide } from '@/components/animation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchRecentScrapes } from '@/lib/scrape';
import { type OutputSchema, inputSchema, outputSchema, scrapeSchema } from '@/schema/scrape';
import { useQueryState } from 'nuqs';
import React from 'react';
import { All, Scraper } from '.';
import { ScrapeCard } from '.';

export const Recent = ({
  recent,
}: {
  recent: OutputSchema[];
}) => {
  return (
    <>
      {recent.map((scrape, index) => (
        <Slide key={scrape.output_id} delay={index * 0.1}>
          <ScrapeCard all={scrape} />
        </Slide>
      ))}
    </>
  );
};
