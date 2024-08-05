import axios from 'axios';

export const getYoutubeResponse = async (input: string) => {
  const params: { query: string; pageToken?: string | null } = {
    query: input,
  };

  const response = await axios.get('/api/v1/youtube', { params });

  return { data: response.data };
};
