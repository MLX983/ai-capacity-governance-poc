import type { FlaggedRequest } from "./requests";

/**
 * Guided POC — Sales Ops Screen 2 (click map + motion spec).
 * Reference: design/screenshots/POC3_Screenshots.pdf
 */
export const SALES_OPS_SCREEN2_DEMO_CARD_ID = "req-s2-01";

/** “Executive pipeline briefing” — premium link enabled after demo top card is removed */
export const SALES_OPS_EXECUTIVE_BRIEFING_ID = "req-2041";

/** View stack: slide / fade between screens */
export const VIEW_TRANSITION_MS = 450;

/** Screen 2: full-size opacity fade before the row leaves the queue */
export const REQUEST_CARD_FADE_MS = 600;

/** Screen 2: FLIP translateY for remaining list items after a row is removed */
export const REQUEST_LIST_FLIP_MS = 600;

export function salesOpsGuidedDemoComplete(
  requests: readonly FlaggedRequest[],
): boolean {
  const demo = requests.find((r) => r.id === SALES_OPS_SCREEN2_DEMO_CARD_ID);
  const exec = requests.find((r) => r.id === SALES_OPS_EXECUTIVE_BRIEFING_ID);
  return demo?.status === "approved" && exec?.status === "approved";
}
