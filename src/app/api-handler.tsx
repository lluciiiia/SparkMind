import axios from "axios";

export const getYoutubeResponse = async (input: string) => {
  const params: { query: string; pageToken?: string | null } = {
    query: input,
  };

  const response = await axios.get("/api/v1/youtube", { params });

  return { data: response.data };
};

export const saveOutput = async (input: string, myLearningId: string) => {
  const processInputResponse = await processInput(input, myLearningId);

  if (processInputResponse.status === 200) {
    await processFinalizing(
      input,
      myLearningId,
      processInputResponse.data.outputId
    );
  } else {
    throw new Error("processInput failed : " + processInputResponse);
  }
};

export const processInput = async (input: string, myLearningId: string) => {
  return await axios.post(
    `/api/v1/outputs/input-processing?id=${myLearningId}`,
    {
      input: input,
    }
  );
};

export const processFinalizing = async (
  input: string,
  myLearningId: string,
  outputId: string
) => {
  return await axios.post(
    `/api/v1/outputs/finalize-processing?id=${myLearningId}&output-id=${outputId}`,
    {
      input: input,
    }
  );
};

export const getOutput = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get("/api/v1/outputs", { params });
  return { data: response.data };
};

export const createNote = async (myLearningId: string) => {
  const response = await axios.post(`/api/v1/notes?id=${myLearningId}`);
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

export const getIsVideoUploaded = async (myLearningId: string) => {
  const response = await axios.get("/api/v1/check-video", {
    params: { learningid: myLearningId },
  });

  return response.status === 200 && response.data.exists;
};
