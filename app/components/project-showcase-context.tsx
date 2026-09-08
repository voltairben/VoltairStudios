"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Binds ProjectReel (the static 2-card showcase) and ProjectIndex (the
// right-hand nav list) together — same minimal Context pattern
// skybox-context.tsx already uses for a cross-component synced value.
//
// Simplified twice now. First pass: dropped a scroll-target request
// (click an index item, reel scrolls to match) once the reel became a
// continuous auto-loop with no real scroll position to jump to — that
// version derived an `activeIndex` from the loop's own elapsed-time
// formula instead. Second pass, this one: the reel itself went fully
// static (2 real case studies, no more loop — direct request, "pivot
// homepage showcase... to a premium, statically locked showcase"), so
// there's no ambient "currently showing" position left to track at
// all — `activeIndex`/`reportActiveIndex` are gone. Only the
// pointer-driven state below is still real.
//
// Also used to carry a card-to-page view-transition-name morph gate
// (morphSource) — retired once the page-transition overlay took over
// navigation entirely: the native View Transition that morph depended
// on rendered in the browser's top layer, above the overlay regardless
// of z-index, which was the real cause of a "sees the destination
// header before the transition finishes" bug (see ProjectReel.tsx and
// ProjectIndex.tsx's own comments).
type ProjectShowcaseContextValue = {
  /** The project (by slug) the pointer is currently over, on *either*
   *  surface — direct request for a bidirectional hover: hover a reel
   *  tile, the matching index entry highlights; hover an index entry,
   *  the matching reel tile gets its own hover pop. Null the rest of
   *  the time. Only ever set for the 2 real projects — ProjectIndex's
   *  4 "coming soon" placeholder slots are non-interactive and never
   *  touch this. */
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
};

const ProjectShowcaseContext = createContext<ProjectShowcaseContextValue | null>(null);

export function ProjectShowcaseProvider({ children }: { children: ReactNode }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <ProjectShowcaseContext.Provider value={{ hoveredSlug, setHoveredSlug }}>
      {children}
    </ProjectShowcaseContext.Provider>
  );
}

export function useProjectShowcase() {
  const ctx = useContext(ProjectShowcaseContext);
  if (!ctx) throw new Error("useProjectShowcase must be used within ProjectShowcaseProvider");
  return ctx;
}
