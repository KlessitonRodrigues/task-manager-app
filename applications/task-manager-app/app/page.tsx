import { LoadScreen } from '@packages/daisy-ui-components';
import { Suspense } from 'react';

export default function RootPage() {
  return <Suspense fallback={<LoadScreen />} />;
}
