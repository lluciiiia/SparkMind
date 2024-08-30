import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import React from 'react';

type InfoItem = {
  link: string;
  title: string;
  snippet: string;
  thumbnail?: { src: string; width: string; height: string };
};

type Props = {
  furtherInfo: InfoItem[];
};

export default function FurtherInfoCard({ furtherInfo }: Props) {
  if (!Array.isArray(furtherInfo) || furtherInfo.length === 0) {
    return (
      <Card className="w-full h-[calc(100vh-200px)]">
        <CardHeader>
          <CardTitle>Further Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No further information available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Further Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {furtherInfo.map((info, index) => (
            <div key={info.link || index} className="flex space-x-4 p-4 border-b last:border-b-0">
              {info.thumbnail && (
                <Image
                  src={info.thumbnail.src}
                  alt={info.title || 'Thumbnail'}
                  width={Number.parseInt(info.thumbnail.width) || 100}
                  height={Number.parseInt(info.thumbnail.height) || 100}
                  className="object-cover rounded"
                />
              )}
              <div>
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold text-lg"
                >
                  {info.title || 'Untitled'}
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  {info.snippet || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
