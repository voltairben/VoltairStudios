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
type MorphSource = "reel" | "index" | null;

type ProjectShowcaseContextValue = {
  activeIndex: number;
  reportActiveIndex: (i: number) => void;
  /** Which surface currently owns the card-to-page view-transition-name —
   *  ProjectReel and ProjectIndex both render every project (reel: 6x
   *  duplicated for the infinite-scroll illusion, index: once each), so
   *  without this gate, clicking a reel tile would leave the index's own
   *  copy of that same project statically tagged too — two DOM elements
   *  sharing one view-transition-name, which the browser rejects. Only
   *  the surface that was actually clicked tags its element. */
  morphSource: MorphSource;
  setMorphSource: (source: MorphSource) => void;
  /** The project (by slug) the pointer is currently over, on *either*
   *  surface — direct request for a bidirectional hover: hover a reel
   *  tile, the matching index entry highlights; hover an index entry,
   *  the matching reel tile(s) get their own hover pop. Deliberately a
   *  separate value from activeIndex above: that's the reel's ambient
   *  auto-loop position (always-on, nothing to do with the pointer),
   *  this is engagement-driven and null the rest of the time. */
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
};

const ProjectShowcaseContext = createContext<ProjectShowcaseContextValue | null>(null);

export function ProjectShowcaseProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [morphSource, setMorphSource] = useState<MorphSource>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const reportActiveIndex = useCallback((i: number) => {
    setActiveIndex(i);
  }, []);

  return (
    <ProjectShowcaseContext.Provider
      value={{
        activeIndex,
        reportActiveIndex,
        morphSource,
        setMorphSource,
        hoveredSlug,
        setHoveredSlug,
      }}
    >
      {children}
    </ProjectShowcaseContext.Provider>
  );
}

export function useProjectShowcase() {
  const ctx = useContext(ProjectShowcaseContext);
  if (!ctx) throw new Error("useProjectShowcase must be used within ProjectShowcaseProvider");
  return ctx;
}
