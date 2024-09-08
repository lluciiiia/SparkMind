import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import he from 'he';
import { ExternalLink, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { memo, useState } from 'react';
import type { VideoCardProps, VideoItem } from '../interfaces';

const VideoCard: React.FC<VideoCardProps> = memo(({ videos }) => {
  const isValidVideo = (video: VideoItem): boolean => {
    return (
      video &&
      video.id &&
      typeof video.id.videoId === 'string' &&
      video.snippet &&
      typeof video.snippet.title === 'string' &&
      typeof video.snippet.description === 'string'
    );
  };

  const validVideos = videos?.filter(isValidVideo) || [];

  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});
  const [viewedVideos, setViewedVideos] = useState<{ [key: string]: boolean }>({});

  const handleLike = (videoId: string) => {
    setLikedVideos((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const handleView = (videoId: string) => {
    setViewedVideos((prev) => ({ ...prev, [videoId]: true }));
  };

  return (
    <Card className="w-full h-[calc(100vh-200px)] bg-background">
      <CardHeader className="bg-muted sr-only">
        <CardTitle className="text-2xl font-bold text-primary">Video Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {validVideos.length > 0 ? (
            validVideos.map((video) => (
              <div
                key={video.id.videoId}
                className="flex flex-col md:flex-row p-4 border-b border-border hover:bg-accent/5 transition-colors"
                onMouseEnter={() => handleView(video.id.videoId)}
              >
                <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={he.decode(video.snippet.title)}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    ></iframe>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-primary">
                    {he.decode(video.snippet.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {he.decode(video.snippet.description)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className={`text-xs text-navy dark:text-white`}>
                      <Eye className="w-3 h-3 mr-1 dark:text-white" />
                      {viewedVideos[video.id.videoId] ? 'Not viewed' : 'Viewed'}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs cursor-pointer text-navy dark:text-white`}
                      onClick={() => handleLike(video.id.videoId)}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1 dark:text-white" />
                      {likedVideos[video.id.videoId] ? 'Liked' : 'Not liked'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white bg-navy hover:bg-navy/90 hover:text-white"
                    asChild
                  >
                    <Link
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">No valid videos found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
