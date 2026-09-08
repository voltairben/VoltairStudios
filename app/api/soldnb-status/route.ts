// This project's first-ever backend code — a deliberate, direct-request
// exception to PRODUCT.md's "no backend, every route is static" (see
// that file's Open Placeholders / this feature's own design discussion).
// Exists for exactly one reason: soldnb.com sends no
// Access-Control-Allow-Origin header, so a browser can't read its live
// HTML cross-origin — only a server can.
//
// Extraction is a plain substring match against real, confirmed text —
// verified directly against the live site before writing this, not
// guessed: soldnb.com's own real offline-state markup contains the
// literal string "no carrier" (in a real, server-rendered <p>, not a
// buried JS bundle constant — checked). If that string is present,
// this honestly reports the real confirmed-offline copy. If it's NOT
// present, the page has changed from the one verified sample — which
// could mean Sol is actually live right now, but there's no verified
// sample of what that state's markup looks like, so this reports an
// honest "unknown, go look" rather than guessing/fabricating what
// "live" copy might say (this project never fabricates real-looking
// content — see PRODUCT.md).
const OFFLINE_MARKER = "no carrier";
const TARGET_URL = "https://soldnb.com";

export async function GET() {
  try {
    const res = await fetch(TARGET_URL, {
      // 30s edge/server cache — a real courtesy to a third-party site,
      // not a correctness requirement (this isn't a security- or
      // money-critical read); avoids hammering their server if a few
      // visitors check within the same half-minute.
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return Response.json({ led: "error", text: "soldnb.com unreachable" });
    }
    const html = await res.text();
    if (html.includes(OFFLINE_MARKER)) {
      return Response.json({ led: "offline", text: "platter idle · STANDBY // SIGNAL_LOST" });
    }
    return Response.json({ led: "unknown", text: "status unknown — might be live, check soldnb.com" });
  } catch {
    return Response.json({ led: "error", text: "soldnb.com unreachable" });
  }
}
