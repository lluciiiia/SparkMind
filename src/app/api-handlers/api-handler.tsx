import axios from 'axios';

export const saveOutput = async (input: string, myLearningId: string) => {
  const processInputResponse = await handleRequest(() => validateSave(input, myLearningId));
  const outputId = processInputResponse.data.outputId;

  await handleRequest(() => processInput(input, myLearningId, outputId));
  await handleRequest(() => processFinalizing(input, myLearningId, outputId));
  await handleRequest(() => processActionItems(myLearningId, outputId));
};

const handleRequest = async (request: () => Promise<any>) => {
  const response = await request();
  if (response.status !== 200) {
    throw new Error(`${request.name} failed: ` + response);
  }
  return response;
};

const validateSave = async (input: string, myLearningId: string) => {
  return axios.post(`/api/v1/outputs/validate-save?id=${myLearningId}`, {
    input: input,
  });
};

const processInput = async (input: string, myLearningId: string, outputId: string) => {
  return axios.post(`/api/v1/outputs/input-processing?id=${myLearningId}&output-id=${outputId}`, {
    input: input,
  });
};

const processFinalizing = async (input: string, myLearningId: string, outputId: string) => {
  return axios.post(
    `/api/v1/outputs/finalize-processing?id=${myLearningId}&output-id=${outputId}`,
    { input: input },
  );
};

const processActionItems = async (myLearningId: string, outputId: string) => {
  return axios.post(
    `/api/v1/outputs/action-items-processing?id=${myLearningId}&output-id=${outputId}`,
  );
};

export const processDefaultTitle = async (myLearningId: string) => {
  return axios.patch(`/api/v1/outputs/learning-title-processing?id=${myLearningId}`);
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
