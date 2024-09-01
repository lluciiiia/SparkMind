import axios from 'axios';

export const createNote = async (myLearningId: string) => {
  try {
    const response = await axios.post(`/api/v1/notes?id=${myLearningId}`, {
      title: `New Note ${new Date().toLocaleString()}`,
      content: 'Start typing here...',
    });
    return { data: response.data, success: true };
  } catch (error) {
    console.error('Error in createNote:', error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const editNote = async (id: string, title: string, content: string) => {
  try {
    const response = await axios.put(`/api/v1/notes/${id}`, {
      title: title,
      content: content,
    });
    return { data: response.data, success: true };
  } catch (error) {
    console.error('Error in editNote:', error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const deleteNote = async (id: string) => {
  try {
    const response = await axios.delete(`/api/v1/notes/${id}`);
    return { data: response.data, success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { data: null, success: false };
  }
};

export const getNotes = async (myLearningId: string) => {
  try {
    const response = await axios.get(`/api/v1/notes/${myLearningId}`);
    return { data: response.data.notes || [] };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { data: [] }; // Return an empty array in case of error
  }
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
