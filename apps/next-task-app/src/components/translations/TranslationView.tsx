'use client';
import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import { useFormSchema } from '@/lib/hooks/useFormSchema';
import useTranslationAPI from '@/lib/hooks/useTranslationAPI';
import { createTranslateSchemas } from '@packages/common-types';
import {
  AreaInputField,
  Column,
  Form,
  IconButton,
  Paper,
  Row,
  SelectField,
  Text,
  TitleIcon,
} from '@packages/daisy-ui-components';

const initialData = {
  text: 'Hello! I am a translator and this is a translation example from English to any other language your chose.',
  sourceLanguageCode: 'auto',
  targetLanguageCode: 'pt',
};

const TranslationView = () => {
  const { t, lang } = useClientTranslations();
  const { translateTextSchema } = createTranslateSchemas({ lang });
  const { langOptions, translateTextQuery, translateResult } = useTranslationAPI();
  const { register, handleSubmit, setValue, watchValue, errors } = useFormSchema(
    translateTextSchema,
    initialData,
  );
  const handleTranslate = (data: any) => translateTextQuery.mutate(data);

  const textFieldValue = watchValue('text');

  return (
    <Form onSubmit={handleSubmit(handleTranslate)}>
      <Paper>
        <Column flexX="start" gap={0}>
          <TitleIcon icon="translate" title={'Tradutor'} />
          <Text opacity="70">{t('translator.description')}</Text>
          <Row flexY="start" responsive="lg">
            <Column flexX="start" gap={0}>
              <SelectField
                className="max-w-xs"
                options={[{ value: 'auto', label: t('translator.detectLanguage') }]}
                defaultValue={watchValue('sourceLanguageCode')}
                onChange={value => setValue('sourceLanguageCode', value)}
                error={errors.sourceLanguageCode?.message as string}
                disabled
              />
              <AreaInputField
                className="min-h-100"
                placeholder={t('translator.textPlaceholder')}
                inputProps={register('text')}
                error={errors.text?.message as string}
              />
              <Text opacity="70">{textFieldValue.length}/500</Text>
            </Column>
            <Column flexX="start" gap={0}>
              <SelectField
                className="max-w-xs"
                options={langOptions}
                defaultValue={watchValue('targetLanguageCode')}
                onChange={value => setValue('targetLanguageCode', value)}
                error={errors.targetLanguageCode?.message as string}
              />
              <AreaInputField
                className="min-h-100"
                placeholder={t('translator.resultPlaceholder')}
                inputProps={{ value: translateResult }}
                loading={translateTextQuery.isPending}
                disabled
              />
            </Column>
          </Row>
        </Column>

        <Row>
          <IconButton
            type="submit"
            color="primary"
            iconType="translate"
            loading={translateTextQuery.isPending}
            disabled={textFieldValue === ''}
          >
            {t('translator.translateButton')}
          </IconButton>
          <IconButton
            type="button"
            mode="outline"
            iconType="brush"
            onClick={() => setValue('text', '')}
          >
            {t('translator.clearButton')}
          </IconButton>
        </Row>
      </Paper>
    </Form>
  );
};

export default TranslationView;
