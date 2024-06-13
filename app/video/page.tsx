"use client";
import React, { useState } from "react";
import axios from "axios";

export default function VideoRecommendations() {
  const [videos, setVideos] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/api/youtube`, { params: { query } });
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-center text-3xl font-bold my-8">
        YouTube Video Recommendations
      </h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a topic"
        className="px-4 text-center"
      />
      <button
        onClick={fetchVideos}
        className="px-4 bg-white mt-8 text-gray-700 rounded border border-gray-200 hover:bg-gray-100 transition">
        Search
      </button>
      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}
