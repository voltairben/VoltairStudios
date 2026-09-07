"use client";

import type { ComponentProps } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";
import { usePageTransition, type TransitionDirection } from "./page-transition-context";

// Thin wrapper for the simple case: a Link with no other onClick logic
// of its own to combine trigger() with (ChromeBar/ProjectReel/
// ProjectIndex each already have real onClick work — flushSync'd morph
// state — so they call trigger() inline instead of using this). Mainly
// exists so Server Components (work/[slug]/page.tsx) can get the
// strip-wipe overlay on a real Link without becoming client components
// themselves just to reach a hook. `direction` defaults to "forward" —
// callers going backward (a back-link) pass "back" explicitly.
//
// v3: preventDefault + an explicit router.push(), not a plain Link
// click anymore — trigger() now owns navigation timing (see
// page-transition-context.tsx's own comment on why: real navigation
// racing the cover animation on its own independent clock is the bug
// that shipped "I see the page, then the transition catches up").
// `href` is narrowed to a plain string (every real call site already
// passes one) so it lines up with useTransitionRouter().push()'s own
// signature — no need to carry Link's full string|UrlObject union.
export default function TransitionLink({
  href,
  onClick,
  direction = "forward",
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; direction?: TransitionDirection }) {
  const { trigger } = usePageTransition();
  const router = useTransitionRouter();
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        trigger(direction, () => router.push(href));
        onClick?.(e);
      }}
    />
  );
}
