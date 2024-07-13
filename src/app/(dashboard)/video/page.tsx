'use client';
import axios from 'axios';
import type React from 'react';
import { useState } from 'react';

interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
  };
}

const VideoRecommendations: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [query, setQuery] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const fetchVideos = async (refresh = false) => {
    try {
      const params: { query: string; pageToken?: string | null } = { query };
      if (refresh && nextPageToken) {
        params.pageToken = nextPageToken;
      }

      const response = await axios.get('/api/youtube', { params });
      const newVideos = response.data.body;
      setVideos(refresh ? newVideos : [...videos, ...newVideos]);
      setNextPageToken(response.data.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-center text-3xl font-bold my-8">YouTube Video Recommendations</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a topic"
        className="px-4 text-center text-black"
      />
      <button
        onClick={() => fetchVideos(false)}
        className="px-4 bg-white mt-8 text-gray-700 rounded border border-gray-200 hover:bg-gray-100 transition"
      >
        Search
      </button>
      <button
        onClick={() => fetchVideos(true)}
        className="px-4 bg-white mt-8 text-gray-700 rounded border border-gray-200 hover:bg-gray-100 transition"
      >
        Refresh
      </button>
      <div>
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id.videoId} className="my-4 flex flex-row items-center mr-8">
              <div className="flex flex-col">
                <h3 className="break-words max-w-lg">Title: {video.snippet.title}</h3>
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
                className="my-4"
              ></iframe>
            </div>
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
};

export default VideoRecommendations;
