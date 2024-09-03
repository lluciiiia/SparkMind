'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { OutputSchema } from '@/schema/scrape';
import { Slugify } from '@/utils';
import { format } from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Check, Copy } from 'lucide-react';
import { marked } from 'marked';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import React from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

const MAX_TITLE_LENGTH = 100; // Adjust this value as needed

export function Recent({ recent }: { recent: OutputSchema[] }) {
  const [currentSlide, setCurrentSlide] = useQueryState('recent', {
    parse: Slugify,
    defaultValue: recent.length > 0 ? Slugify(recent[0].output_id) : '',
    clearOnDefault: false,
  });
  const [currIndex, setCurrIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  useEffect(() => {
    if (recent.length === 0) return;
    const index = recent.findIndex((item) => Slugify(item.output_id) === currentSlide);
    setCurrIndex(index !== -1 ? index : 0);
  }, [currentSlide, recent]);

  useEffect(() => {
    if (recent.length === 0) return;
    const fetchContent = async () => {
      setLoading(true);
      try {
        const text = await marked(recent[currIndex].text_output);
        setContent(text);
      } catch (error) {
        toast.error('Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [currIndex, recent]);

  const handleNext = () => {
    if (currIndex < recent.length - 1) {
      setCurrentSlide(Slugify(recent[currIndex + 1].output_id));
    }
  };

  const handlePrev = () => {
    if (currIndex > 0) {
      setCurrentSlide(Slugify(recent[currIndex - 1].output_id));
    }
  };

  const toggleTitleDisplay = () => {
    setShowFullTitle(!showFullTitle);
  };

  const renderTitle = () => {
    const title = recent[currIndex].prompt_name;
    if (title.length <= MAX_TITLE_LENGTH) {
      return <CardTitle className="text-2xl font-bold">{title}</CardTitle>;
    }

    return (
      <div>
        <CardTitle className="text-2xl font-bold">
          {showFullTitle ? title : `${title.slice(0, MAX_TITLE_LENGTH)}...`}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-muted-foreground"
          onClick={toggleTitleDisplay}
        >
          {showFullTitle ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    );
  };

  const handleCopy = React.useCallback(() => {
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

  if (recent.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 px-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center  bg-opacity-20 z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 " />
        </div>
      )}
      <Card className="w-full">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between">
            {renderTitle()}
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrev} disabled={currIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currIndex === recent.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>Created: {format(new Date(recent[currIndex].created_at), 'PPP')}</p>
            <p className="ml-4">Updated: {format(new Date(recent[currIndex].updated_at), 'PPP')}</p>
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
        </CardFooter>
      </Card>
    </div>
  );
}
