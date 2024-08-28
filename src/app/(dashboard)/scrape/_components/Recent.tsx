'use client';

import { Slide } from '@/components/animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { OutputSchema } from '@/schema/scrape';
import { Slugify } from '@/utils';
import { format } from 'date-fns';
import { marked } from 'marked';
import { useQueryState } from 'nuqs';
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'sonner';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export const Recent = ({
  recent,
}: {
  recent: OutputSchema[];
}) => {
  const [_currentSlide, setCurrentSlide] = useQueryState('recent', {
    parse: Slugify,
    defaultValue: Slugify(recent[0].output_id),
    clearOnDefault: false,
  });
  const [currIndex, setCurrIndex] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>('');
  const total = recent.length;

  const handleNext = () => {
    if (currIndex + 1 < total) {
      setCurrIndex(currIndex + 1);
      setCurrentSlide(Slugify(recent[currIndex + 1].output_id));
    }
  };

  const handlePrev = () => {
    if (currIndex - 1 >= 0) {
      setCurrIndex(currIndex - 1);
      setCurrentSlide(Slugify(recent[currIndex - 1].output_id));
    }
  };

  useIsomorphicLayoutEffect(() => {
    setLoading(true);
    const fetchContent = async () => {
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
  }, [currIndex]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-9 backdrop-blur-sm">
          <div className="Circleloader" />
        </div>
      )}
      <div className="flex flex-row items-center justify-between w-full mx-auto mt-4 px-4">
        <Button className="rounded-full py-2" onClick={handlePrev} disabled={currIndex === 0}>
          <FaArrowLeft />
        </Button>
        {recent.map((scrape, index) => {
          const isActive = index === currIndex;
          return (
            <React.Fragment key={scrape.output_id}>
              {isActive && (
                <Slide delay={index * 0.1}>
                  <Card className="w-full max-h-[80vh] rounded-lg p-4 overflow-hidden">
                    <CardHeader>
                      <CardTitle>{scrape.prompt_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-20rem)] overflow-auto">
                      <ScrollArea className="h-[calc(100%-20rem)] w-full rounded-md border p-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                        <ScrollBar orientation="vertical" />
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center">
                      <p>Created: {format(new Date(scrape.created_at), 'PPP')}</p>
                      <p>Updated: {format(new Date(scrape.updated_at), 'PPP')}</p>
                    </CardFooter>
                  </Card>
                </Slide>
              )}
            </React.Fragment>
          );
        })}
        <Button
          className="rounded-full py-2"
          onClick={handleNext}
          disabled={currIndex === total - 1}
        >
          <FaArrowRight />
        </Button>
      </div>
    </>
  );
};
