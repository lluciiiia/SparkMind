import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const pageToken = url.searchParams.get('pageToken');
    const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;

    if (!query) {
      return NextResponse.json({ error: 'Error extracting text' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const params: {
      part: string;
      q: string;
      type: string;
      maxResults: number;
      key: string;
      pageToken?: string;
    } = {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 10,
      key: apiKey,
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });

    return NextResponse.json(
      {
        body: response.data.items,
        nextPageToken: response.data.nextPageToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching data from YouTube:', error);
    return NextResponse.json({ error: 'Failed to fetch data from YouTube' }, { status: 500 });
  }
}
