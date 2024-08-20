import axios from 'axios';

export const saveOutput = async (input: string, myLearningId: string) => {
  const processInputResponse = await processInput(input, myLearningId);

  if (processInputResponse.status === 200) {
    const outputId = processInputResponse.data.outputId;
    const processFinalizingResponse = await processFinalizing(input, myLearningId, outputId);

    if (processFinalizingResponse.status === 200) {
      const processActionItemsResponse = await processActionItems(myLearningId, outputId);
      if (processActionItemsResponse.status != 200)
        throw new Error('processActionItems failed : ' + processActionItemsResponse);
    } else {
      throw new Error('processFinalizing failed : ' + processFinalizingResponse);
    }
  } else {
    throw new Error('processInput failed : ' + processInputResponse);
  }
};

const processInput = async (input: string, myLearningId: string) => {
  return await axios.post(`/api/v1/outputs/input-processing?id=${myLearningId}`, {
    input: input,
  });
};

const processFinalizing = async (input: string, myLearningId: string, outputId: string) => {
  return await axios.post(
    `/api/v1/outputs/finalize-processing?id=${myLearningId}&output-id=${outputId}`,
    {
      input: input,
    },
  );
};

const processActionItems = async (myLearningId: string, outputId: string) => {
  return await axios.post(
    `/api/v1/outputs/action-items-processing?id=${myLearningId}&output-id=${outputId}`,
  );
};

export const processDefaultTitle = async (myLearningId: string) => {
  return await axios.patch(`/api/v1/outputs/learning-title-processing?id=${myLearningId}`);
};

export const getOutput = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get('/api/v1/outputs', { params });
  return { data: response.data };
};

export const createEvents = async (selectedTask: any, myLearningId: string) => {
  return await axios.post('/api/v1/events', {
    selectedTask: selectedTask,
    learningId: myLearningId,
  });
};
