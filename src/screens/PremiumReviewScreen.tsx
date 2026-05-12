import { useState } from "react";
import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { ROUTE_LABELS } from "../data/requests";

const ROUTE_OPTIONS: RouteOption[] = [
  "small-model",
  "standard-model",
  "premium-model",
  "summarize-first",
  "overnight-batch",
];

interface PremiumReviewScreenProps {
  request: FlaggedRequest;
  onBack: () => void;
  onSelectRoute: (route: RouteOption) => void;
  onApprove: () => void;
  onSendBack: (revision: RevisionOption) => void;
}

export function PremiumReviewScreen({
  request,
  onBack,
  onSelectRoute,
  onApprove,
  onSendBack,
}: PremiumReviewScreenProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="stack premium-review">
      <p className="lede">
        Premium route approval while the team is over allocation. Confirm the
        suggested route or pick a governed alternative.
      </p>
      <section className="panel">
        <h2 className="panel__label">Request</h2>
        <p className="panel__title">{request.title}</p>
        <p className="panel__meta">
          {request.requestor} · {request.estimatedUseLabel}
        </p>
      </section>
      <section className="panel">
        <h2 className="panel__label">Why flagged</h2>
        <p>{request.flagReason}</p>
        <p>{request.rationaleShort}</p>
        {expanded ? <p>{request.rationaleExpanded}</p> : null}
        <button
          type="button"
          className="text-link"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "View less" : "View more"}
        </button>
      </section>
      <section className="panel">
        <h2 className="panel__label">Suggested route</h2>
        <p>{ROUTE_LABELS[request.recommendedRoute]}</p>
        <p className="muted">
          Working selection:{" "}
          <strong>{ROUTE_LABELS[request.selectedRoute]}</strong>
        </p>
      </section>
      <section className="panel">
        <h2 className="panel__label">Alternate routes</h2>
        <ul className="chip-list">
          {ROUTE_OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                className={
                  request.selectedRoute === opt ? "chip chip--active" : "chip"
                }
                onClick={() => onSelectRoute(opt)}
              >
                {ROUTE_LABELS[opt]}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2 className="panel__label">Send back for revision</h2>
        <div className="inline-actions">
          <button
            type="button"
            className="button"
            onClick={() => onSendBack("narrow-scope")}
          >
            Narrow scope
          </button>
          <button
            type="button"
            className="button"
            onClick={() => onSendBack("split-tasks")}
          >
            Split into smaller tasks
          </button>
        </div>
      </section>
      <div className="sticky-actions">
        <button type="button" className="button" onClick={onBack}>
          Back to queue
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={onApprove}
        >
          Approve selected route
        </button>
      </div>
    </div>
  );
}
