"use client";

import { useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";

export default function PTR() {
  useEffect(() => {
    console.log("PTR init running");

    PullToRefresh.init({
      mainElement: "body", // try "html" if this doesn’t fire
      shouldPullToRefresh: () => window.scrollY === 0,
      onRefresh() {
        console.log("PTR triggered ✅ reloading...");
        window.location.reload();
      },
      instructionsPullToRefresh: "Dra ned for å oppdatere",
      instructionsReleaseToRefresh: "Slipp for å oppdatere",
      instructionsRefreshing: "Oppdaterer…",
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return null; // nothing visible
}
