import { videoRecommendationSchema } from '@/server/schemas';
import { google } from 'googleapis';

const API_KEY = (process.env.GOOGLE_YOUTUBE_API_KEY as string) || '';

const youTubeSearch = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

export const searchYouTube = async (query: string) => {
  try {
    const res = await youTubeSearch.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 10,
      key: API_KEY,
    });

    const data = res.data;
    if (!data.items) {
      throw new Error('No items found');
    }

    const results = data.items.map((item: any) => {
      return videoRecommendationSchema.parse({
        videoId: item.id.videoId,
        publishedAt: item.snippet.publishedAt,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        liveBroadcastContent: item.snippet.liveBroadcastContent,
        high: {
          url: item.snippet.thumbnails.high.url,
          height: item.snippet.thumbnails.high.height,
          width: item.snippet.thumbnails.high.width,
        },
      });
    });

    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error fetching data from YouTube:', error);
    throw new Error('Failed to fetch data from YouTube');
  }
};
