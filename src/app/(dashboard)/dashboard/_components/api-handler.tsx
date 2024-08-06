import axios from "axios";

export const getOutputResponse = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get("/api/v1/get-output", { params });
  return { data: response.data };
};

export const getSaveOutputResponse = async (myLearningId: string) => {
  const params: { id: string } = {
    id: myLearningId,
  };

  const response = await axios.get("/api/v1/save-output", { params });

  return { data: response.data };
};