'use client';

import { errorToast } from '@packages/daisy-ui-components';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import queryClient from '../config/queryClient';
import { translateText } from '../services/translation';

const langOptions = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
];

const useTranslationAPI = () => {
  const [translateResult, setTranslateResult] = useState('');

  const handleTranslateText = {
    enabled: false,
    mutationKey: ['translate-text'],
    onError: (msg: string) => errorToast(msg),
    mutationFn: async (data: {
      text: string;
      targetLanguageCode: string;
      sourceLanguageCode: string;
    }) => {
      const resData = await translateText(data);
      setTranslateResult(resData.translatedText);
      console.log(resData);
    },
  };

  const translateTextQuery = useMutation(handleTranslateText, queryClient);

  return {
    translateResult,
    langOptions,
    translateTextQuery,
  };
};

export default useTranslationAPI;
