/** Route labels map to governance choices in the review UI. */
export type RouteOption =
  | "small-model"
  | "standard-model"
  | "premium-model"
  | "summarize-first"
  | "overnight-batch";

export type RevisionOption = "narrow-scope" | "split-tasks";

export type RequestStatus = "queued" | "approved" | "sent-back";

/** Figma Screen 3 expanded — extra rows under Request Summary before “View less” */
export interface PremiumExpandedDetails {
  businessPriority: string;
  estimatedUsage: string;
  whyThisRoute: string;
}

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
  /** Figma Screen 3 — Request summary (optional; falls back to rationale fields) */
  premiumPurpose?: string;
  premiumScope?: string;
  premiumDueDate?: string;
  /** Figma Screen 3 — three lines under “Why Flagged” */
  premiumWhyLines?: readonly [string, string, string];
  /** Second line in “Suggested route” card, e.g. “Lower-cost: Standard model first” */
  premiumLowerCostLine?: string;
  /** Figma Screen 3 expanded — three labeled paragraphs under the summary block */
  premiumExpandedDetails?: PremiumExpandedDetails;
  /** Figma Screen 2 — card 1 uses “Selected route”; default “Recommended route” */
  screen2RouteHeading?: "selected" | "recommended";
}

export interface TeamCapacity {
  id: string;
  name: string;
  /** Optional; omitted on Figma Screen 1 */
  weeklyAllocationLabel?: string;
  /** 0–100+ — Screen 1 shows whole-number usage */
  usedPercent: number;
  trendLabel: string;
  /** Figma: WarningDiamond + semibold on the Usage line */
  usageWarning?: boolean;
  /** Figma: WarningDiamond + semibold on the Trend line */
  trendWarning?: boolean;
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

/** Figma Screen 1 — “AI Capacity by Team” (node 6002:631) */
export const INITIAL_TEAMS: TeamCapacity[] = [
  {
    id: "sales-ops",
    name: "Sales Operations",
    usedPercent: 92,
    trendLabel: "Above weekly allocation",
    usageWarning: true,
  },
  {
    id: "risk-review",
    name: "Risk Review",
    usedPercent: 61,
    trendLabel: "Normal",
  },
  {
    id: "customer-support",
    name: "Customer Support",
    usedPercent: 78,
    trendLabel: "Spike detected",
    trendWarning: true,
  },
];

function teamQueueRequest(
  id: string,
  teamId: string,
  title: string,
  requestor: string,
  estimatedUseLabel: string,
  route: RouteOption,
  overrides?: Partial<FlaggedRequest>,
): FlaggedRequest {
  return {
    id,
    teamId,
    title,
    requestor,
    estimatedUseLabel,
    recommendedRoute: route,
    selectedRoute: route,
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Queued for governance review.",
    rationaleShort: "Synthetic copy for the POC queue.",
    rationaleExpanded: "Replace with policy-backed text when extending the POC.",
    ...overrides,
  };
}

/** Figma Screen 2 — Risk Review queue (titles are scenario-specific, not stubs) */
const RISK_REVIEW_REQUESTS: FlaggedRequest[] = [
  teamQueueRequest(
    "rr-01",
    "risk-review",
    "Model output attribution mismatch",
    "Risk Analytics",
    "High",
    "standard-model",
  ),
  teamQueueRequest(
    "rr-02",
    "risk-review",
    "Regulatory disclosure draft review",
    "Compliance",
    "Medium",
    "summarize-first",
  ),
  teamQueueRequest(
    "rr-03",
    "risk-review",
    "Escalated exception — vendor model change",
    "Third-Party Risk",
    "High",
    "premium-model",
    { requiresPremiumReview: true },
  ),
];

/** Figma Screen 2 — Customer Support queue */
const CUSTOMER_SUPPORT_REQUESTS: FlaggedRequest[] = [
  teamQueueRequest(
    "cs-01",
    "customer-support",
    "Ticket thread summarization — billing",
    "Support Tier 2",
    "Medium",
    "standard-model",
  ),
  teamQueueRequest(
    "cs-02",
    "customer-support",
    "Refund eligibility summary",
    "Billing Support",
    "Low",
    "small-model",
  ),
  teamQueueRequest(
    "cs-03",
    "customer-support",
    "SLA breach response draft",
    "Enterprise Support",
    "High",
    "standard-model",
  ),
  teamQueueRequest(
    "cs-04",
    "customer-support",
    "Knowledge-base gap analysis",
    "Content Ops",
    "Medium",
    "summarize-first",
  ),
  teamQueueRequest(
    "cs-05",
    "customer-support",
    "Escalated tone review (enterprise)",
    "Support Lead",
    "High",
    "premium-model",
    { requiresPremiumReview: true },
  ),
  teamQueueRequest(
    "cs-06",
    "customer-support",
    "Multi-ticket incident rollup",
    "Incident Command",
    "High",
    "standard-model",
  ),
  teamQueueRequest(
    "cs-07",
    "customer-support",
    "Product return policy Q&A pack",
    "Retail Support",
    "Medium",
    "small-model",
  ),
  teamQueueRequest(
    "cs-08",
    "customer-support",
    "Chat transcript cleanup (PII)",
    "Trust & Safety",
    "High",
    "standard-model",
  ),
  teamQueueRequest(
    "cs-09",
    "customer-support",
    "CSAT dip diagnostic summary",
    "Voice of Customer",
    "Medium",
    "summarize-first",
  ),
  teamQueueRequest(
    "cs-10",
    "customer-support",
    "Onboarding email refresh variants",
    "Lifecycle Support",
    "Low",
    "small-model",
  ),
  teamQueueRequest(
    "cs-11",
    "customer-support",
    "Seasonal surge forecast note",
    "Workforce Planning",
    "Medium",
    "overnight-batch",
  ),
  teamQueueRequest(
    "cs-12",
    "customer-support",
    "Partner portal error triage digest",
    "Partner Support",
    "Medium",
    "standard-model",
  ),
];

const SALES_OPS_REQUESTS: FlaggedRequest[] = [
  {
    id: "req-s2-01",
    teamId: "sales-ops",
    title: "Detailed outreach report",
    requestor: "Sales Strategy",
    estimatedUseLabel: "High",
    recommendedRoute: "overnight-batch",
    selectedRoute: "overnight-batch",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
  {
    id: "req-s2-02",
    teamId: "sales-ops",
    title: "Client follow-up summary",
    requestor: "Regional Sales",
    estimatedUseLabel: "Medium",
    recommendedRoute: "standard-model",
    selectedRoute: "standard-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
  {
    id: "req-2041",
    teamId: "sales-ops",
    title: "Executive pipeline briefing",
    requestor: "Sales Leadership",
    estimatedUseLabel: "High",
    recommendedRoute: "premium-model",
    selectedRoute: "premium-model",
    requiresPremiumReview: true,
    status: "queued",
    flagReason: "Premium route while team is over weekly allocation.",
    rationaleShort:
      "Cross-region roll-up with exec narrative; policy recommends premium for board-facing summaries under pressure.",
    rationaleExpanded:
      "Source spans CRM, CPQ, and a manual forecast workbook. Standard summarization has missed edge cases on commit timing in prior cycles; premium path preserves numeric parity with finance sign-off.",
    premiumPurpose:
      "Create a concise executive summary of pipeline health, momentum, and risk areas for the weekly leadership meeting.",
    premiumScope:
      "Sales pipeline data across 4 regions, covering 200 open opportunities over the last 90 days.",
    premiumDueDate: "Today, 4 PM",
    premiumWhyLines: [
      "Premium model recommended",
      "High estimated usage",
      "Team usage already above trend",
    ],
    premiumLowerCostLine: "Lower-cost: Standard model first",
    premiumExpandedDetails: {
      businessPriority:
        "High: Supports the weekly leadership review and near-term forecast discussion.",
      estimatedUsage:
        "High: Requires cross-region comparison, trend synthesis, and executive-ready summarization across a broad dataset.",
      whyThisRoute:
        "This request spans multiple regions and a long time range, and the output needs to be concise and presentation-ready. A premium model is recommended for stronger synthesis and cleaner narrative quality. A standard model can be used first if the team wants a lower-cost draft before expanding.",
    },
  },
  {
    id: "req-s2-04",
    teamId: "sales-ops",
    title: "Regional pipeline rollup",
    requestor: "Sales Planning",
    estimatedUseLabel: "Medium",
    recommendedRoute: "standard-model",
    selectedRoute: "standard-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
  {
    id: "req-s2-05",
    teamId: "sales-ops",
    title: "Win/loss theme analysis",
    requestor: "Revenue Operations",
    estimatedUseLabel: "High",
    recommendedRoute: "summarize-first",
    selectedRoute: "summarize-first",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
  {
    id: "req-s2-06",
    teamId: "sales-ops",
    title: "Territory activity digest",
    requestor: "Regional Sales",
    estimatedUseLabel: "Low",
    recommendedRoute: "small-model",
    selectedRoute: "small-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
  {
    id: "req-2035",
    teamId: "sales-ops",
    title: "QBR prep pack",
    requestor: "Sales Leadership",
    estimatedUseLabel: "High",
    recommendedRoute: "premium-model",
    selectedRoute: "premium-model",
    requiresPremiumReview: true,
    status: "queued",
    flagReason: "Premium route while team is over weekly allocation.",
    rationaleShort:
      "Multi-stakeholder QBR storyline with customer evidence pulls; premium flagged for accuracy and tone control.",
    rationaleExpanded:
      "Notes and slides reference draft numbers still under review. A cheaper route risks stale figures in customer-facing excerpts; premium review gates publish until leadership confirms the final set.",
    premiumPurpose:
      "Produce leadership-ready QBR slides and narrative from approved draft metrics and customer call excerpts.",
    premiumScope:
      "Current-quarter pipeline, win/loss themes, and customer references across three regions.",
    premiumDueDate: "Tomorrow, 9 AM",
    premiumWhyLines: [
      "Premium model recommended",
      "High estimated usage",
      "Team usage already above trend",
    ],
    premiumLowerCostLine: "Lower-cost: Summarize first, then standard model",
    premiumExpandedDetails: {
      businessPriority:
        "High: QBR materials must align with approved metrics and leadership messaging before customer touchpoints.",
      estimatedUsage:
        "High: Weaves pipeline themes, win/loss patterns, and call excerpts into a single leadership-ready storyline.",
      whyThisRoute:
        "Draft figures and qualitative evidence sit together where accuracy and tone matter for excerpts that may reach customers. Premium improves coherence and reduces the risk of stale numbers. Summarize-first or standard paths work if the team accepts a thinner first pass before polish.",
    },
  },
  {
    id: "req-s2-08",
    teamId: "sales-ops",
    title: "CRM note cleanup",
    requestor: "Sales Operations",
    estimatedUseLabel: "Medium",
    recommendedRoute: "standard-model",
    selectedRoute: "standard-model",
    requiresPremiumReview: false,
    status: "queued",
    flagReason: "Screen 2 reference row.",
    rationaleShort: "Synthetic copy aligned to Figma.",
    rationaleExpanded: "Extend with real policy text as needed.",
  },
];

export const INITIAL_REQUESTS: FlaggedRequest[] = [
  ...SALES_OPS_REQUESTS,
  ...RISK_REVIEW_REQUESTS,
  ...CUSTOMER_SUPPORT_REQUESTS,
];

export function queuedRequestsForTeam(
  requests: FlaggedRequest[],
  teamId: string,
): FlaggedRequest[] {
  return requests.filter((r) => r.teamId === teamId && r.status === "queued");
}
