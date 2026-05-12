import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { REVISION_LABELS, ROUTE_LABELS } from "../data/requests";

const ROUTE_OPTIONS: RouteOption[] = [
  "small-model",
  "standard-model",
  "premium-model",
  "summarize-first",
  "overnight-batch",
];

const REVISION_OPTIONS: RevisionOption[] = ["narrow-scope", "split-tasks"];

interface RoutingPanelProps {
  request: FlaggedRequest;
  onClose: () => void;
  onSelectRoute: (route: RouteOption) => void;
  onSendBack: (option: RevisionOption) => void;
}

export function RoutingPanel({
  request,
  onClose,
  onSelectRoute,
  onSendBack,
}: RoutingPanelProps) {
  return (
    <div className="routing-panel-overlay" role="presentation">
      <button
        type="button"
        className="routing-panel-overlay__backdrop"
        aria-label="Close routing panel"
        onClick={onClose}
      />
      <div className="routing-panel" role="dialog" aria-labelledby="routing-panel-title">
        <div className="routing-panel__header">
          <h2 id="routing-panel-title">Edit routing</h2>
          <button type="button" className="link-button" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="routing-panel__request-title">{request.title}</p>
        <section className="routing-panel__section">
          <h3 className="routing-panel__section-title">Model routing</h3>
          <ul className="routing-panel__options">
            {ROUTE_OPTIONS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={
                    request.selectedRoute === opt
                      ? "routing-option routing-option--active"
                      : "routing-option"
                  }
                  onClick={() => onSelectRoute(opt)}
                >
                  {ROUTE_LABELS[opt]}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="routing-panel__section">
          <h3 className="routing-panel__section-title">Send back for revision</h3>
          <p className="routing-panel__help">
            Revision actions return the request to the requestor; they do not
            approve compute.
          </p>
          <ul className="routing-panel__options">
            {REVISION_OPTIONS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className="routing-option routing-option--danger"
                  onClick={() => onSendBack(opt)}
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
