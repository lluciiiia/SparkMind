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

  return { data: response.data };
};

export const getOutputResponse = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get('/api/v1/get-output', { params });
  return { data: response.data };
};

export const createNote = async (myLearningId: string) => {
  const response = await axios.post(`/api/v1/notes?id=${myLearningId}`);
  console.log('response: ' + response.data);
  return { data: response.data };
};

export const editNote = async (id: string, title: string, content: string) => {
  const response = await axios.put(`/api/v1/notes?id=${id}`, {
    title: title,
    content: content,
  });

  return { data: response.data };
};

export const deleteNote = async (id: string) => {
  const response = await axios.delete(`/api/v1/notes?id=${id}`);

  return { data: response.data };
};

export const getNotes = async (myLearningId: string) => {
  const response = await axios.get(`/api/v1/notes?id=${myLearningId}`);
  return { data: response.data };
};

export const getGrammarNote = async (content: string) => {
  const response = await axios.post(`/api/v1/note-ai/grammar`, {
    note: content,
  });
  return { data: response.data };
};

export const getConciseNote = async (content: string) => {
  const response = await axios.post(`/api/v1/note-ai/concise`, {
    note: content,
  });
  return { data: response.data };
};
