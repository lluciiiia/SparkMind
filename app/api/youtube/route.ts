import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.status(200).json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from YouTube" });
  }
}
