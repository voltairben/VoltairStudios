// Small pulsing status dot for `status soldnb`'s result — direct
// request ("Add a subtle pulsing LED component"). Two real colors, not
// three: this system's own green LED token was already removed once
// on direct request ("the logo's green is no longer a CSS token at
// all... now it only ever appears via the real logo image asset
// itself" — see globals.css's own :root comment) and DESIGN.md's own
// Don'ts ban reviving it as a site accent. "accent" (persimmon, this
// site's real "look here" color — the headline, the cursor, Contact)
// reuses that existing role for the one state actually worth a second
// look (status unknown, possibly live); every routine/settled state
// (checking, confirmed offline, unreachable) gets the muted neutral
// every other de-emphasized element on this site already uses.
export type LEDVariant = "muted" | "accent";

export default function StatusLED({ variant }: { variant: LEDVariant }) {
  return <span className={`status-led status-led-${variant}`} aria-hidden="true" />;
}
