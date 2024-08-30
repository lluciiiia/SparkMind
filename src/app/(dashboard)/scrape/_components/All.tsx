'use client';

import { Slide } from '@/components/animation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useState, useCallback } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

import type { OutputSchema } from '@/schema';
const ITEMS_PER_PAGE = 20;

const All = memo(
  ({ query, page = 1, all }: { query: string; page: number; all: OutputSchema[] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.max(1, Math.ceil(all.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    useIsomorphicLayoutEffect(() => {
      setIsLoading(true);
      // Simulating data loading effect
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }, [query, currentPage]);

    const createQueryString = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        if (name !== 'query') params.set('query', query);
        return params.toString();
      },
      [searchParams, query],
    );

    const handlePageChange = useCallback(
      (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
          router.push(`?${createQueryString('page', newPage.toString())}`, { scroll: false });
        }
      },
      [router, createQueryString, totalPages],
    );

    const paginatedItems = all.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

    return (
      <>
        <section
          className={`
            h-fit w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pr-3 max-w-full overflow-y-scroll
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <article key={index} className="h-[150px] bg-gray-200 animate-pulse rounded-lg" />
            ))
          ) : (
            paginatedItems.map((scrape: OutputSchema, index: number) => (
              <Slide delay={index * 0.1} key={scrape.output_id}>
                <ScrapeCard all={scrape} />
              </Slide>
            ))
          )}
        </section>
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    );
  },
);

All.displayName = 'All';

export { All };

const ScrapeCard = ({ all }: { all: OutputSchema }) => {
  const [content, setContent] = useState('');
  useIsomorphicLayoutEffect(() => {
    const fetchContent = async () => {
      const text = await marked(all.text_output);
      setContent(text);
    };
    fetchContent();
  }, [all.text_output]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Dialog>
        <DialogTrigger>
          <Card
            className={`
							w-[250px] h-[150px] overflow-hidden
							shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg
						`}
          >
            <CardHeader>
              <h3 className="text-lg font-semibold truncate">{all.prompt_name}</h3>
            </CardHeader>
            <CardFooter className="flex mx-auto justify-center items-center text-xs text-gray-500">
              <span>Created: {format(new Date(all.created_at), 'PPpp')}</span>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-[80dvh]">
          <h2 className="text-xl font-semibold mb-4">{all.prompt_name}</h2>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="mt-4 text-sm text-gray-500 flex flex-row justify-between items-center">
            <p>Created: {format(new Date(all.created_at), 'PPP')}</p>
            <p>Updated: {format(new Date(all.updated_at), 'PPP')}</p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
