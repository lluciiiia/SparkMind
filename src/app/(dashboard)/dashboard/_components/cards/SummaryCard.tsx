import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useState, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

type Props = { summaryData?: string };

export default function SummaryCard({ summaryData }: Props) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      if (!summaryData) {
        setHtmlContent('');
        setIsLoading(false);
        return;
      }

      try {
        const content = await marked(summaryData);
        const sanitizedContent = DOMPurify.sanitize(content);
        setHtmlContent(sanitizedContent);
      } catch (err) {
        console.error('Error parsing markdown:', err);
        setError('Failed to parse summary data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [summaryData]);

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading summary...</p>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : htmlContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose prose-sm max-w-none dark:prose-invert"
            />
          ) : (
            <div className="text-gray-500">No summary available</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
