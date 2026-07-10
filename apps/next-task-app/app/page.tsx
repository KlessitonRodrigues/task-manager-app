import { LoadScreen } from "@packages/daisy-ui-components/common/loaders/LoadScreen.js";
import { Suspense } from "react";

export default function RootPage() {
  return <Suspense fallback={<LoadScreen />} />;
}
