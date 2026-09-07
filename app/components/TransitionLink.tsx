"use client";

import type { ComponentProps } from "react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { usePageTransition, type TransitionDirection } from "./page-transition-context";

// Thin wrapper for the simple case: a Link with no other onClick logic
// of its own to combine trigger() with (ChromeBar/ProjectReel/
// ProjectIndex each already have real onClick work, so they call
// trigger() inline instead of using this). Mainly exists so Server
// Components (work/[slug]/page.tsx) can get the block-wipe overlay on
// a real Link without becoming client components themselves just to
// reach a hook. `direction` defaults to "forward" — callers going
// backward (a back-link) pass "back" explicitly.
//
// v3: preventDefault + an explicit router.push(), not a plain Link
// click anymore — trigger() now owns navigation timing (see
// page-transition-context.tsx's own comment on why: real navigation
// racing the cover animation on its own independent clock is the bug
// that shipped "I see the page, then the transition catches up").
//
// v8: plain next/navigation useRouter(), not next-view-transitions'
// useTransitionRouter() — direct report ("shows me the header of the
// page before the transition is done"). Real cause, confirmed via
// direct instrumentation: useTransitionRouter().push() unconditionally
// wraps every navigation in document.startViewTransition(), and that
// API's pseudo-element tree renders in the browser's top layer —
// above ANY regular z-indexed element, including this overlay,
// regardless of z-index value. Now that this overlay is the entire
// visible transition, that native view transition (built for the
// separate, pre-existing card-to-page title morph — see
// ProjectReel.tsx/ProjectIndex.tsx) was the thing actually escaping
// the cover. Still rendering next-view-transitions' own <Link> below
// (its own click never fires real navigation here — preventDefault
// stops it before it would check for View Transition support — so
// nothing about keeping it re-triggers this), just navigating through
// a router that was never wrapped in the API to begin with.
// `href` is narrowed to a plain string (every real call site already
// passes one) so it lines up with useRouter().push()'s own signature.
export default function TransitionLink({
  href,
  onClick,
  direction = "forward",
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; direction?: TransitionDirection }) {
  const { trigger } = usePageTransition();
  const router = useRouter();
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
