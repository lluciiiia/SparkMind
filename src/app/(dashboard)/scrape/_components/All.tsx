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
import { fetchAllScrapes } from '@/lib/scrape';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <Skeleton key={index} className="h-[200px] w-full rounded-lg" />
              ))
            : all.slice((page - 1) * 20, page * 20).map((scrape: OutputSchema, index: number) => {
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
              <PaginationPrevious href={`?query=${query}&page=${page - 1}`} isActive={page === 1} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`?query=${query}&page=${pageNum}`}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?query=${query}&page=${page + 1}`}
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
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const ScrapeCard = ({ all }: { all: OutputSchema }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Dialog>
        <DialogTrigger>
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <h3 className="text-lg font-semibold truncate">{all.prompt_name}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{all.text_output}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-xs text-gray-500">
              <span>Created: {format(new Date(all.created_at), 'PP')}</span>
              <span>Updated: {format(new Date(all.updated_at), 'PP')}</span>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <h2 className="text-xl font-semibold mb-4">{all.prompt_name}</h2>
          <p className="text-gray-700">{all.text_output}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Created: {format(new Date(all.created_at), 'PPP')}</p>
            <p>Updated: {format(new Date(all.updated_at), 'PPP')}</p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
