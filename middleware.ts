import { NextResponse, type NextRequest } from "next/server";

// Direct request ("make an under construction screen for the website
// so people cant enter it") — gates every route (real domain AND every
// *.vercel.app URL, since middleware runs regardless of which host the
// request came in on) behind /coming-soon until launch. PREVIEW_BYPASS_SECRET
// is a Vercel-only env var (never committed — this is a public repo,
// so a hardcoded secret here would let anyone reading the source walk
// straight past the gate), set once in the Vercel dashboard. Visiting
// with ?preview=<secret> sets a cookie and continues through; without
// it, every request gets rewritten to /coming-soon at whatever URL was
// actually typed — a rewrite, not a redirect, so the address bar still
// shows what the visitor asked for instead of leaking which real
// routes exist via a redirect chain.
const BYPASS_COOKIE = "voltair_preview";
const BYPASS_PARAM = "preview";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Never gate the coming-soon page itself (infinite rewrite loop),
  // Next's own static/image pipeline, or the handful of well-known
  // static files browsers/crawlers request unprompted.
  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.PREVIEW_BYPASS_SECRET;
  // No secret configured — fail open to "gate everyone, no bypass
  // exists yet" rather than fail closed and lock out the one person
  // who'd need to set the env var in the first place.
  if (!secret) {
    return rewriteToComingSoon(request);
  }

  const bypassParam = searchParams.get(BYPASS_PARAM);
  if (bypassParam === secret) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete(BYPASS_PARAM);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(BYPASS_COOKIE, secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  }

  if (request.cookies.get(BYPASS_COOKIE)?.value === secret) {
    return NextResponse.next();
  }

  return rewriteToComingSoon(request);
}

function rewriteToComingSoon(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  const response = NextResponse.rewrite(url);
  // The real route (still shown in the address bar via rewrite, not
  // redirect) shouldn't get indexed under placeholder content — the
  // page's own metadata covers a direct/bookmarked hit on /coming-soon
  // itself, this covers every OTHER path being served through it.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
