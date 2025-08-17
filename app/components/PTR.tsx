"use client";

import { useEffect } from "react";

import PullToRefresh from "pulltorefreshjs";

export default function PTR() {
  useEffect(() => {
    PullToRefresh.init({
      // iOS PWA is picky — target the top-level scroller:
      mainElement: "html",
      // only allow when scrolled to top
      shouldPullToRefresh: () => typeof window !== "undefined" && window.scrollY === 0,
      onRefresh() {
        // simple full reload
        window.location.reload();
      },
      // optional UI strings
      instructionsPullToRefresh: "Dra ned for å oppdatere",
      instructionsReleaseToRefresh: "Slipp for å oppdatere",
      instructionsRefreshing: "Oppdaterer…",
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return null; // nothing to render
}
