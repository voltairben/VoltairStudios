"use client";

import type { ComponentProps } from "react";
import { Link } from "next-view-transitions";
import { usePageTransition } from "./page-transition-context";

// Thin wrapper for the simple case: a Link with no other onClick logic
// of its own to combine trigger() with (ChromeBar/ProjectReel/
// ProjectIndex each already have real onClick work — flushSync'd morph
// state — so they call trigger() inline instead of using this). Mainly
// exists so Server Components (work/[slug]/page.tsx) can get the
// block-wipe overlay on a real Link without becoming client components
// themselves just to reach a hook.
export default function TransitionLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const { trigger } = usePageTransition();
  return (
    <Link
      {...props}
      onClick={(e) => {
        trigger();
        onClick?.(e);
      }}
    />
  );
}
