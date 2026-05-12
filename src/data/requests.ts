/** Route labels map to governance choices in the review UI. */
export type RouteOption =
  | "small-model"
  | "standard-model"
  | "premium-model"
  | "summarize-first"
  | "overnight-batch";

export type RevisionOption = "narrow-scope" | "split-tasks";

export type RequestStatus = "queued" | "approved" | "sent-back";

export interface FlaggedRequest {
  id: string;
  teamId: string;
  title: string;
  requestor: string;
  /** Human-readable estimate for demo purposes */
  estimatedUseLabel: string;
  recommendedRoute: RouteOption;
  /** Current working selection; defaults to recommended until reviewer edits */
  selectedRoute: RouteOption;
  requiresPremiumReview: boolean;
  status: RequestStatus;
  flagReason: string;
  rationaleShort: string;
  rationaleExpanded: string;
}

export interface TeamCapacity {
  id: string;
  name: string;
  weeklyAllocationLabel: string;
  /** 0–100+ for “above allocation” story */
  usedPercent: number;
  trendLabel: string;
}

export const ROUTE_LABELS: Record<RouteOption, string> = {
  "small-model": "Small model",
  "standard-model": "Standard model",
  "premium-model": "Premium model",
  "summarize-first": "Summarize first",
  "overnight-batch": "Overnight batch",
};

export const REVISION_LABELS: Record<RevisionOption, string> = {
  "narrow-scope": "Narrow scope",
  "split-tasks": "Split into smaller tasks",
};

export const INITIAL_TEAMS: TeamCapacity[] = [
  {
    id: "sales-ops",
    name: "Sales Operations",
    weeklyAllocationLabel: "120k equiv. tokens / week",
    usedPercent: 118,
    trendLabel: "Above 4-week trend",
  },
  {
    id: "finance",
    name: "Finance",
    weeklyAllocationLabel: "80k equiv. tokens / week",
    usedPercent: 62,
    trendLabel: "Within trend",
  },
  {
    id: "product",
    name: "Product",
    weeklyAllocationLabel: "95k equiv. tokens / week",
    usedPercent: 71,
    trendLabel: "Within trend",
  },
];

export const INITIAL_REQUESTS: FlaggedRequest[] = [
  {
    id: "req-2041",
    teamId: "sales-ops",
    title: "Executive pipeline briefing",
    requestor: "Jordan Lee",
    estimatedUseLabel: "~$22 · 2.8M tokens",
    recommendedRoute: "premium-model",
    selectedRoute: "premium-model",
    requiresPremiumReview: true,
    status: "queued",
    flagReason: "Premium route while team is over weekly allocation.",
    rationaleShort:
      "Cross-region roll-up with exec narrative; policy recommends premium for board-facing summaries under pressure.",
    rationaleExpanded:
      "Source spans CRM, CPQ, and a manual forecast workbook. Standard summarization has missed edge cases on commit timing in prior cycles; premium path preserves numeric parity with finance sign-off.",
  },
  {
    id: "req-2038",
    teamId: "sales-ops",
    title: "Draft outreach variants for enterprise pilot list",
    requestor: "Sam Rivera",
    estimatedUseLabel: "~$6 · 900k tokens",
    recommendedRoute: "standard-model",
    selectedRoute: "standard-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Request volume spike vs. team baseline.",
    rationaleShort: "Batch job pattern fits standard routing after light trimming.",
    rationaleExpanded:
      "List is 4k contacts; model can chunk by segment. Overnight batch is viable if same-day send is not required.",
  },
  {
    id: "req-2035",
    teamId: "sales-ops",
    title: "QBR prep pack",
    requestor: "Alex Chen",
    estimatedUseLabel: "~$16 · 2.1M tokens",
    recommendedRoute: "premium-model",
    selectedRoute: "premium-model",
    requiresPremiumReview: true,
    status: "queued",
    flagReason: "Premium route while team is over weekly allocation.",
    rationaleShort:
      "Multi-stakeholder QBR storyline with customer evidence pulls; premium flagged for accuracy and tone control.",
    rationaleExpanded:
      "Notes and slides reference draft numbers still under review. A cheaper route risks stale figures in customer-facing excerpts; premium review gates publish until leadership confirms the final set.",
  },
  {
    id: "req-2032",
    teamId: "sales-ops",
    title: "Competitive battlecards refresh (5 segments)",
    requestor: "Morgan Patel",
    estimatedUseLabel: "~$9 · 1.1M tokens",
    recommendedRoute: "overnight-batch",
    selectedRoute: "overnight-batch",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Non-urgent content refresh flagged under capacity pressure.",
    rationaleShort: "No SLA today; batch defers load off peak hours.",
    rationaleExpanded:
      "Stakeholder deadline is end of week; overnight batch meets that with lower peak concurrency.",
  },
  {
    id: "req-2029",
    teamId: "sales-ops",
    title: "Inbound lead scoring explanation snippets",
    requestor: "Riley Kim",
    estimatedUseLabel: "~$4 · 600k tokens",
    recommendedRoute: "small-model",
    selectedRoute: "small-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Cluster of similar requests in one afternoon.",
    rationaleShort: "Short explanations; small model is policy-default here.",
    rationaleExpanded:
      "Outputs are templated one-liners with citations to static policy text.",
  },
  {
    id: "req-2026",
    teamId: "sales-ops",
    title: "Pipeline stage definitions — natural language to rules",
    requestor: "Taylor Brooks",
    estimatedUseLabel: "~$7 · 1.0M tokens",
    recommendedRoute: "standard-model",
    selectedRoute: "standard-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Elevated concurrency vs. rolling average.",
    rationaleShort: "Standard model sufficient for rule-like transformations.",
    rationaleExpanded:
      "Inputs are short paragraphs per stage; no long-context dependency.",
  },
  {
    id: "req-2023",
    teamId: "sales-ops",
    title: "Quote configuration sanity check (bulk SKUs)",
    requestor: "Casey Nguyen",
    estimatedUseLabel: "~$8 · 1.3M tokens",
    recommendedRoute: "overnight-batch",
    selectedRoute: "overnight-batch",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Bulk job while team is near capacity.",
    rationaleShort: "Overnight batch spreads load and preserves SLA buffer.",
    rationaleExpanded:
      "Results feed a weekly batch export; intraday completion is not required.",
  },
  {
    id: "req-2020",
    teamId: "sales-ops",
    title: "Partner enablement one-pagers (localized)",
    requestor: "Jamie Ortiz",
    estimatedUseLabel: "~$5 · 750k tokens",
    recommendedRoute: "summarize-first",
    selectedRoute: "summarize-first",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Localization adds token multiplier vs. baseline.",
    rationaleShort: "Summarize source English before localized expansion.",
    rationaleExpanded:
      "Style guide allows condensed source; expansion per locale stays smaller.",
  },
];

export function queuedRequestsForTeam(
  requests: FlaggedRequest[],
  teamId: string,
): FlaggedRequest[] {
  return requests.filter((r) => r.teamId === teamId && r.status === "queued");
}
