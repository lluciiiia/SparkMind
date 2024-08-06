import { Card } from '@/components/ui/card';
import type React from 'react';
import { type VideoCardProps, VideoItem } from '../interfaces';

const VideoCard: React.FC<VideoCardProps> = ({ videos }) => {
  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl">
      <div className="flex flex-col h-full overflow-y-auto rounded-t-3xl items-center">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id.videoId}
              className="w-full flex flex-row px-8 py-4 border-b border-gray-200"
            >
              <div className="flex flex-col mr-8 l-0">
                <h3 className="break-words font-bold">{video.snippet.title}</h3>
                <p className="break-words mt-2">Description: {video.snippet.description}</p>
              </div>
              <iframe
                className="flex-shrink-0 ml-auto"
                width="120"
                height="100"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <div className="flex h-full justify-center items-center">
            <p>No videos found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoCard;
