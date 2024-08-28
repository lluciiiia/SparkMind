'use client';

import { Slide } from '@/components/animation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import type { OutputSchema } from '@/schema';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

const All = memo(
  ({ query, page = 1, all }: { query: string; page: number; all: OutputSchema[] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const totalPages = Math.ceil(all.length / 20);
    useIsomorphicLayoutEffect(() => {
      setIsLoading(true);
    }, [query, page]);
    return (
      <>
        <div className="h-fit w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pr-3">
          {all.slice((page - 1) * 20, page * 20).map((scrape: OutputSchema, index: number) => {
            return (
              <Slide delay={index * 0.1} key={scrape.output_id}>
                <ScrapeCard all={scrape} />
              </Slide>
            );
          })}
        </div>
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?query=${query}&page=${page}`}
                target={`_self`}
                isActive={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`?query=${query}&page=${pageNum}`}
                  target={`_self`}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?query=${query}&page=${page + 1}`}
                target={`_self`}
                isActive={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    );
  },
);

export { All };

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { marked } from 'marked';

export const ScrapeCard = ({ all }: { all: OutputSchema }) => {
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
          <Card className="max-w-[300px] max-h-[225px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
