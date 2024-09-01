import axios from 'axios';

export const saveOutput = async (
  input: string,
  myLearningId: string,
  userId: string,
  title: string,
) => {
  try {
    const processInputResponse = await handleRequest(() =>
      validateSave(input, myLearningId, userId, title),
    );

    if (!processInputResponse || !processInputResponse.data || !processInputResponse.data.output) {
      throw new Error('Invalid response from validateSave');
    }

    const output = processInputResponse.data.output;

    if (!output.id) {
      throw new Error('Output is missing id');
    }

    await handleRequest(() => processInputStep1(input, myLearningId, output));
    await handleRequest(() => processInputStep2(input, myLearningId, output));
    await handleRequest(() => processFinalizing(input, myLearningId, output));
    await handleRequest(() => processActionItems(myLearningId, output.id));

    return output;
  } catch (error) {
    console.error('Error in saveOutput:', error);
    throw error;
  }
};

const handleRequest = async (request: () => Promise<any>) => {
  const response = await request();
  if (response.status !== 200) {
    throw new Error(`${request.name} failed: ` + response);
  }
  return response;
};

const validateSave = async (input: string, myLearningId: string, userId: string, title: string) => {
  return axios.post(`/api/v1/outputs/validate-save?id=${myLearningId}`, {
    input,
    userId,
    title,
  });
};

const processInputStep1 = async (input: string, myLearningId: string, output: string) => {
  return axios.post(`/api/v1/outputs/input-step1?id=${myLearningId}`, {
    input: input,
    output: output,
  });
};

const processInputStep2 = async (input: string, myLearningId: string, output: string) => {
  return axios.post(`/api/v1/outputs/input-step2?id=${myLearningId}`, {
    input: input,
    output: output,
  });
};

const processFinalizing = async (input: string, myLearningId: string, output: string) => {
  return axios.post(`/api/v1/outputs/finalize-processing?id=${myLearningId}`, {
    input: input,
    output: output,
  });
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

export const createNote = async (myLearningId: string) => {
  try {
    const response = await axios.post(`/api/v1/notes?id=${myLearningId}`);
    return response.data;
  } catch (error) {
    // Instead of throwing, return an object indicating the error
    return { error: true, message: 'Failed to create note' };
  }
};
