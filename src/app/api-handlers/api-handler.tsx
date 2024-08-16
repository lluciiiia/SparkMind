import axios from 'axios';

export const getYoutubeResponse = async (input: string) => {
  const params: { query: string; pageToken?: string | null } = {
    query: input,
  };

  const response = await axios.get('/api/v1/youtube', { params });

  return { data: response.data };
};

export const saveOutput = async (input: string, myLearningId: string) => {
  const processInputResponse = await processInput(input, myLearningId);

  if (processInputResponse.status === 200) {
    await processFinalizing(input, myLearningId, processInputResponse.data.outputId);
  } else {
    throw new Error('processInput failed : ' + processInputResponse);
  }
};

export const processInput = async (input: string, myLearningId: string) => {
  return await axios.post(`/api/v1/outputs/input-processing?id=${myLearningId}`, {
    input: input,
  });
};

export const processFinalizing = async (input: string, myLearningId: string, outputId: string) => {
  return await axios.post(
    `/api/v1/outputs/finalize-processing?id=${myLearningId}&output-id=${outputId}`,
    {
      input: input,
    },
  );
};

export const getOutput = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get('/api/v1/outputs', { params });
  return { data: response.data };
};

export const getIsVideoUploaded = async (myLearningId: string) => {
  const response = await axios.get('/api/v1/check-video', {
    params: { learningid: myLearningId },
  });

  return response.status === 200 && response.data.exists;
};

export const getIsActionPreviewDone = async (myLearningId: string) => {
  const response = await axios.get('/api/v1/action-previews', {
    params: { learningid: myLearningId },
  });
  return response.status === 200 && response.data.check;
};

export const getListOfEvents = async (myLearningId: string, getFromText?: boolean) => {
  const response = await axios.get('/api/v1/event-list', {
    params: { LearningId: myLearningId, getfromtext: getFromText },
  });
  return response.data;
};

export const getTodoTasks = async (myLearningId: string) => {
  const response = await axios.get('/api/v1/todo-tasks', {
    params: { learning_id: myLearningId },
  });
  return response;
};

export const createEvents = async (selectedTask: any, myLearningId: string) => {
  const response = await axios.post('/api/v1/events', {
    selectedTask: selectedTask,
    learningId: myLearningId,
  });
  return response;
};
