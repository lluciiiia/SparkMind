import type { NextApiRequest } from "next";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const query = url.searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Error extracting text" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ body: response.data.items }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from YouTube:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from YouTube" },
      { status: 500 }
    );
  }
}
