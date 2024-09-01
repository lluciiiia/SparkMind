import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type React from 'react';
import { memo } from 'react';
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

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Video Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {validVideos.length > 0 ? (
            validVideos.map((video) => (
              <div key={video.id.videoId} className="flex mb-4 pb-4 border-b last:border-b-0">
                <div className="flex-grow pr-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.snippet.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {video.snippet.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <iframe
                    width="160"
                    height="90"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.snippet.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  ></iframe>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No valid videos found</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
