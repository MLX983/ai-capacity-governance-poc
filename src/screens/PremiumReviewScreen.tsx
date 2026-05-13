import { useMemo, useState } from "react";
import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { REVISION_LABELS, ROUTE_LABELS } from "../data/requests";

const ROUTE_OPTIONS: RouteOption[] = [
  "small-model",
  "standard-model",
  "premium-model",
  "summarize-first",
  "overnight-batch",
];

const PANEL_ROUTE_LABELS: Record<RouteOption, string> = {
  "small-model": "Route to small model",
  "standard-model": "Route to standard model",
  "premium-model": "Route to premium model",
  "summarize-first": "Summarize first",
  "overnight-batch": "Run overnight batch",
};

const REVISION_OPTIONS: RevisionOption[] = ["narrow-scope", "split-tasks"];

function whyLinesFor(request: FlaggedRequest): readonly [string, string, string] {
  if (request.premiumWhyLines) {
    return request.premiumWhyLines;
  }
  const line1 =
    request.recommendedRoute === "premium-model"
      ? "Premium model recommended"
      : `${ROUTE_LABELS[request.recommendedRoute]} recommended`;
  const line2 = `${request.estimatedUseLabel} estimated usage`;
  const line3 = request.flagReason;
  return [line1, line2, line3];
}

interface PremiumReviewScreenProps {
  request: FlaggedRequest;
  /** When false, “Request revision” chips are non-interactive (POC / PDF) */
  revisionActionsEnabled?: boolean;
  /** Guided POC: only this route chip is clickable; others look normal */
  demoOnlyRouteOption?: RouteOption;
  onSelectRoute: (route: RouteOption) => void;
  onSendBack: (revision: RevisionOption) => void;
  /**
   * When the “Route to premium model” chip is already selected, a click runs this
   * (slide back to queue + remove briefing card) instead of a no-op.
   */
  onConfirmPremiumRoute?: () => void;
}

export function PremiumReviewScreen({
  request,
  revisionActionsEnabled = true,
  demoOnlyRouteOption,
  onSelectRoute,
  onSendBack,
  onConfirmPremiumRoute,
}: PremiumReviewScreenProps) {
  const [expanded, setExpanded] = useState(false);

  const purpose = request.premiumPurpose ?? request.rationaleShort;
  const scope = request.premiumScope ?? request.flagReason;
  const due = request.premiumDueDate ?? "—";
  const whyLines = useMemo(() => whyLinesFor(request), [request]);
  const lowerCost =
    request.premiumLowerCostLine ??
    `Lower-cost: ${ROUTE_LABELS["standard-model"]} first`;

  const accordionBody =
    request.premiumExpandedDetails != null ? (
      <dl className="premium-screen__dl premium-screen__dl--accordion">
        <div>
          <dt>Business priority</dt>
          <dd>{request.premiumExpandedDetails.businessPriority}</dd>
        </div>
        <div>
          <dt>Estimated usage</dt>
          <dd>{request.premiumExpandedDetails.estimatedUsage}</dd>
        </div>
        <div>
          <dt>Why this route was recommended</dt>
          <dd>{request.premiumExpandedDetails.whyThisRoute}</dd>
        </div>
      </dl>
    ) : (
      <p className="premium-screen__expanded">{request.rationaleExpanded}</p>
    );

  return (
    <div className="premium-screen">
      <p className="premium-screen__intro">{request.title}</p>

      <section className="premium-screen__section" aria-labelledby="premium-summary-heading">
        <h2 id="premium-summary-heading" className="premium-screen__section-title">
          Request Summary
        </h2>
        <dl className="premium-screen__dl">
          <div>
            <dt>Requested by</dt>
            <dd>{request.requestor}</dd>
          </div>
          <div>
            <dt>Purpose</dt>
            <dd>{purpose}</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd>{scope}</dd>
          </div>
          <div>
            <dt>Due date</dt>
            <dd>{due}</dd>
          </div>
        </dl>
        <div
          className={
            expanded
              ? "premium-screen__accordion premium-screen__accordion--open"
              : "premium-screen__accordion"
          }
          aria-hidden={!expanded}
        >
          <div className="premium-screen__accordion-inner">{accordionBody}</div>
        </div>
        <button
          type="button"
          className="premium-screen__view-more link-button"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "View less" : "View more"}
        </button>
      </section>

      <div className="premium-screen__below-fold">
        <section className="premium-screen__section" aria-labelledby="premium-why-heading">
          <h2 id="premium-why-heading" className="premium-screen__section-title">
            Why Flagged
          </h2>
          <div className="premium-screen__plain-lines">
            {whyLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        <section className="premium-screen__section" aria-labelledby="premium-suggested-heading">
          <h2 id="premium-suggested-heading" className="premium-screen__section-title">
            Suggested Route
          </h2>
          <p className="premium-screen__suggested">
            Primary: {ROUTE_LABELS[request.recommendedRoute]}
            <br />
            {lowerCost}
          </p>
        </section>

        <section className="premium-screen__section" aria-labelledby="premium-routing-heading">
          <h3 id="premium-routing-heading" className="premium-screen__group-label">
            Routing options
          </h3>
          <ul className="routing-chip-list">
            {ROUTE_OPTIONS.map((opt) => {
              const routeLocked =
                demoOnlyRouteOption != null && opt !== demoOnlyRouteOption;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    className={
                      routeLocked
                        ? request.selectedRoute === opt
                          ? "routing-chip routing-chip--selected poc-action-guard"
                          : "routing-chip poc-action-guard"
                        : request.selectedRoute === opt
                          ? "routing-chip routing-chip--selected"
                          : "routing-chip"
                    }
                    aria-disabled={routeLocked || undefined}
                    tabIndex={routeLocked ? -1 : undefined}
                    onClick={() => {
                      if (routeLocked) return;
                      if (
                        opt === "premium-model" &&
                        request.selectedRoute === "premium-model"
                      ) {
                        onConfirmPremiumRoute?.();
                        return;
                      }
                      onSelectRoute(opt);
                    }}
                  >
                    {PANEL_ROUTE_LABELS[opt]}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="premium-screen__section" aria-labelledby="premium-revision-heading">
          <h3 id="premium-revision-heading" className="premium-screen__group-label">
            Request revision
          </h3>
          <ul className="routing-chip-list">
            {REVISION_OPTIONS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={
                    revisionActionsEnabled
                      ? "routing-chip routing-chip--revision"
                      : "routing-chip routing-chip--revision poc-action-guard"
                  }
                  aria-disabled={!revisionActionsEnabled}
                  tabIndex={revisionActionsEnabled ? undefined : -1}
                  onClick={() => {
                    if (!revisionActionsEnabled) return;
                    onSendBack(opt);
                  }}
                >
                  {REVISION_LABELS[opt]}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
