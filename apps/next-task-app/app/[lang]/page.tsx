"use client";
import { Page, PageContent } from "@packages/daisy-ui-components";
import { useEffect } from "react";

import { colorfullFilter } from "@/src/utils/js-shaders/colorfull";
import { sharpnessFilter } from "@/src/utils/js-shaders/sharpness";

export default function TemplatePage() {
  return (
    <Page className="mt-8">
      <PageContent>
        <div>TEST</div>
        <video autoPlay controls muted loop src="/video/anime.mp4"></video>
      </PageContent>
    </Page>
  );
}
