import TranslationView from '@/lib/components/translations/TranslationView';
import { Page, PageContent } from '@packages/daisy-ui-components';

export default async function TemplatePage() {
  return (
    <Page className="mt-8">
      <PageContent>
        <TranslationView />
      </PageContent>
    </Page>
  );
}
