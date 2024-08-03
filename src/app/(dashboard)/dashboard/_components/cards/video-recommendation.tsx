import React from "react";
import { Card } from "@/components/ui/card";
import { VideoItem, VideoCardProps } from "../interfaces";

const VideoCard: React.FC<VideoCardProps> = ({ videos, color }) => {
  return (
    <Card className={`w-full h-200 ${color} mb-4`}>
      <div>
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id.videoId}
              className="my-4 flex flex-row items-center mr-8">
              <div className="flex flex-col">
                <h3 className="break-words max-w-lg">
                  Title: {video.snippet.title}
                </h3>
                <p className="break-words max-w-lg mt-4">
                  Description: {video.snippet.description}
                </p>
              </div>
              <iframe
                width="250"
                height="160"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="my-4"></iframe>
            </div>
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </Card>
  );
};

export default VideoCard;
