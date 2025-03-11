import axios from "axios";

const API_URL = "https://vanishvote.na-api-bundle.cyou/api";

export const createPoll = async (pollData) => {
  const response = await axios.post(`${API_URL}/polls`, pollData);
  return response.data;
};

export const getPoll = async (id) => {
  const response = await axios.get(`${API_URL}/polls/${id}`);
  return response.data;
};

export const votePoll = async (id, optionIndex) => {
  const response = await axios.post(`${API_URL}/polls/${id}/vote`, {
    optionIndex,
  });
  return response.data;
};

export const addComment = async (id, text) => {
  const response = await axios.post(`${API_URL}/polls/${id}/comments`, {
    text,
  });
  return response.data;
};

export const addReaction = async (id, type) => {
  const response = await axios.post(`${API_URL}/polls/${id}/reactions`, {
    type,
  });
  return response.data;
};
