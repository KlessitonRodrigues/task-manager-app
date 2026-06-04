import { translationApiClient } from '../config/axiosClient';

export const translateText = async (data: any) => {
  try {
    return (await translationApiClient.post('/translate/text', data))?.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
};
