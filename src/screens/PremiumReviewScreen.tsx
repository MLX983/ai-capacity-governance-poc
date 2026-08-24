import { useMemo, useState } from "react";
import type { FlaggedRequest } from "../data/requests";
import { ROUTE_LABELS } from "../data/requests";
import {
  RoutingChoiceList,
  type RoutingChoice,
} from "../components/RoutingChoiceList";

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
  /** When false, “Request revision” radios are non-interactive (POC / PDF) */
  revisionActionsEnabled?: boolean;
  onSave: (choice: RoutingChoice) => void;
  onCancel: () => void;
}

export function PremiumReviewScreen({
  request,
  revisionActionsEnabled = true,
  onSave,
  onCancel,
}: PremiumReviewScreenProps) {
  const [expanded, setExpanded] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<RoutingChoice | null>(
    null,
  );

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

  function commitPending() {
    if (pendingChoice == null) {
      onCancel();
      return;
    }
    onSave(pendingChoice);
  }

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
        <section
          className="premium-screen__section premium-screen__section--no-divider"
          aria-labelledby="premium-why-heading"
        >
          <h2 id="premium-why-heading" className="premium-screen__section-title">
            Why Flagged
          </h2>
          <div className="premium-screen__plain-lines">
            {whyLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        <section
          className="premium-screen__section premium-screen__section--no-divider"
          aria-labelledby="premium-suggested-heading"
        >
          <h2 id="premium-suggested-heading" className="premium-screen__section-title">
            Suggested Route
          </h2>
          <p className="premium-screen__suggested">
            Primary: {ROUTE_LABELS[request.recommendedRoute]}
            <br />
            {lowerCost}
          </p>
        </section>

        <section
          className="premium-screen__section premium-screen__section--routing"
          aria-label="Routing decision"
        >
          <RoutingChoiceList
            name="premium-routing"
            value={pendingChoice}
            onChange={setPendingChoice}
            onSave={commitPending}
            onCancel={onCancel}
            revisionEnabled={revisionActionsEnabled}
          />
        </section>
      </div>
    </div>
  );
}
