'use client';

import { Slide } from '@/components/animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { deleteOutput } from '@/lib/scrape';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { marked } from 'marked';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { useCopyToClipboard } from 'usehooks-ts';

import type { OutputSchema } from '@/schema';
const ITEMS_PER_PAGE = 20;

const All = memo(
  ({ query, page = 1, all }: { query: string; page: number; all: OutputSchema[] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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

    const handleSelectItem = (id: string) => {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    };

    const handleSelectAll = () => {
      if (selectedItems.length === paginatedItems.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(paginatedItems.map((item) => item.output_id));
      }
    };

    const handleDelete = async () => {
      try {
        await Promise.all(selectedItems.map((id) => deleteOutput(id)));
        toast.success('Selected items deleted successfully');
        router.refresh();
      } catch (error) {
        console.error('Error deleting items:', error);
        toast.error('Failed to delete selected items');
      }
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedItems.length === paginatedItems.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-500">
              {selectedItems.length} of {paginatedItems.length}
            </span>
          </div>
          <Button
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
            variant="destructive"
          >
            Delete Selected
          </Button>
        </div>
        <section
          className={`
            h-fit w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pr-3 max-w-full overflow-y-scroll pl-3 pt-4
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {isLoading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <article key={index} className="h-[150px] bg-gray-200 animate-pulse rounded-lg" />
              ))
            : paginatedItems.map((scrape: OutputSchema, index: number) => (
                <Slide delay={index * 0.1} key={scrape.output_id}>
                  <ScrapeCard
                    all={scrape}
                    isSelected={selectedItems.includes(scrape.output_id)}
                    onSelect={() => handleSelectItem(scrape.output_id)}
                  />
                </Slide>
              ))}
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

const ScrapeCard = ({
  all,
  isSelected,
  onSelect,
}: { all: OutputSchema; isSelected: boolean; onSelect: () => void }) => {
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  useIsomorphicLayoutEffect(() => {
    const fetchContent = async () => {
      const text = await marked(all.text_output);
      setContent(text);
    };
    fetchContent();
  }, [all.text_output]);

  const handleCopy = useCallback(() => {
    const textContent = stripHtmlTags(content);
    copy(textContent)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        toast.error(`Failed to copy! ${error instanceof Error ? error.message : String(error)}`);
      });
  }, [content, copy]);

  const stripHtmlTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <Dialog>
        <DialogTrigger>
          <Card
            className={`
              w-[250px] h-[150px] overflow-hidden
              shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg
              ${isSelected ? 'ring-2 ring-primary' : ''}
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
          <DialogHeader>
            <DialogTitle>{all.prompt_name}</DialogTitle>
            <DialogDescription>
              Created on {format(new Date(all.created_at), 'PPP')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="mt-4 text-sm text-gray-500 flex flex-row justify-between items-center">
            <p>Created: {format(new Date(all.created_at), 'PPP')}</p>
            <p>Updated: {format(new Date(all.updated_at), 'PPP')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
