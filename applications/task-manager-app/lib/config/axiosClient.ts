import axios from 'axios';

import dotenv from '../constants/dotenv';

export const translationApiClient = axios.create({
  baseURL: dotenv.TRANSLATION_API_URL,
  headers: {
    lang: 'pt',
    'Content-Type': 'application/json',
    'x-api-key': dotenv.TRANSLATION_API_KEY,
  },
});
