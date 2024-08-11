import axios from 'axios';

export const getYoutubeResponse = async (input: string) => {
  const params: { query: string; pageToken?: string | null } = {
    query: input,
  };

  const response = await axios.get('/api/v1/youtube', { params });

  return { data: response.data };
};

export const saveOutput = async (input: string, myLearningId: string) => {
  const response = await axios.post(`/api/v1/save-output?id=${myLearningId}`, {
    input: input,
  });
  console.log('response: ', response);

  return { data: response.data };
};
