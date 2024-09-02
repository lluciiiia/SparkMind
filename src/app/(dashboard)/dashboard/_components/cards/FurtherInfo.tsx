import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { memo } from 'react';

type InfoItem = {
  link: string;
  title: string;
  snippet: string;
  thumbnail?: { src: string; width: string; height: string };
};

type Props = {
  furtherInfo: InfoItem[];
};

const FurtherInfoCard = memo(function FurtherInfoCard({ furtherInfo }: Props) {
  if (!Array.isArray(furtherInfo) || furtherInfo.length === 0) {
    return (
      <Card className="w-full h-[calc(100vh-200px)] bg-background">
        <CardHeader className="bg-muted sr-only">
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Further Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">No further information available.</p>
        </CardContent>
      </Card>
    );
  }

  const stopWords = [
    'the',
    'and',
    'of',
    'to',
    'a',
    'in',
    'that',
    'is',
    'with',
    'as',
    'for',
    'on',
    'by',
    'an',
    'be',
    'this',
    'which',
    'or',
    'at',
    'from',
    'it',
    'are',
    'was',
    'were',
    'who',
    'what',
    'when',
    'where',
    'why',
    'how',
  ];

  function extractMainPoint(title: string): string {
    return title
      .split(' ')
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(' ');
  }

  const uniqueTitles = [...new Set(furtherInfo.map((info) => info.title))];
  const mostCommonTitles = uniqueTitles.reduce((acc: Record<string, number>, title) => {
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});
  const mostCommonTitle = Object.keys(mostCommonTitles).reduce((a, b) =>
    mostCommonTitles[a] > mostCommonTitles[b] ? a : b,
  );

  const mainPoint = extractMainPoint(mostCommonTitle);

  return (
    <Card className="w-full h-[calc(100vh-200px)] bg-background">
      <CardHeader className="bg-muted sr-only">
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Further Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {furtherInfo.map((info, index) => (
            <div
              key={info.link || index}
              className="flex flex-col md:flex-row p-6 border-b border-border hover:bg-accent/5 transition-colors"
            >
              {info.thumbnail && (
                <div className="md:w-1/4 mb-4 md:mb-0 md:pr-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {info.thumbnail.src ? (
                      <Image
                        src={info.thumbnail.src}
                        alt={info.title || 'Thumbnail'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform hover:scale-105"
                      />
                    ) : (
                      <Skeleton className="aspect-video rounded-lg bg-gray-200" />
                    )}
                  </div>
                </div>
              )}
              <div className={info.thumbnail ? 'md:w-3/4' : 'w-full'}>
                <h3 className="text-xl font-semibold mb-2 text-primary line-clamp-2">
                  {info.title || 'Untitled'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {info.snippet || 'No description available.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    Resource {index + 1}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {mainPoint}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white bg-navy hover:bg-navy/90"
                  asChild
                >
                  <Link href={info.link} target="_blank" rel="noopener noreferrer">
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

FurtherInfoCard.displayName = 'FurtherInfoCard';

export default FurtherInfoCard;
