"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// Binds ProjectReel (the auto-looping center showcase) and ProjectIndex
// (the right-hand nav list) together — same minimal Context pattern
// skybox-context.tsx already uses for a cross-component synced value.
//
// Simplified down from an earlier version that also carried a
// scroll-target request (click an index item, reel scrolls to match):
// the reel is a continuous, non-interactive CSS auto-loop now (direct,
// repeated request — "it keeps scrolling through every placeholder and
// doesn't stop," matching the reference exactly), so there's no real
// scroll position left to request a jump to. Both components now derive
// activeIndex from the same shared elapsed-time formula in
// ProjectReel.tsx instead, so they stay genuinely in lockstep with the
// CSS loop rather than needing a two-way request/response.
type ProjectShowcaseContextValue = {
  activeIndex: number;
  reportActiveIndex: (i: number) => void;
};

const ProjectShowcaseContext = createContext<ProjectShowcaseContextValue | null>(null);

export function ProjectShowcaseProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const reportActiveIndex = useCallback((i: number) => {
    setActiveIndex(i);
  }, []);

  return (
    <ProjectShowcaseContext.Provider value={{ activeIndex, reportActiveIndex }}>
      {children}
    </ProjectShowcaseContext.Provider>
  );
}

export function useProjectShowcase() {
  const ctx = useContext(ProjectShowcaseContext);
  if (!ctx) throw new Error("useProjectShowcase must be used within ProjectShowcaseProvider");
  return ctx;
}
