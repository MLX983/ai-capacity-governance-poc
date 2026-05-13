import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { REVISION_LABELS } from "../data/requests";
import { CloseXSquareIcon } from "./CloseXSquareIcon";

const ROUTE_OPTIONS: RouteOption[] = [
  "small-model",
  "standard-model",
  "premium-model",
  "summarize-first",
  "overnight-batch",
];

const REVISION_OPTIONS: RevisionOption[] = ["narrow-scope", "split-tasks"];

/** Figma Screen 2 / Routing drawer (node 6010:915) */
const PANEL_ROUTE_LABELS: Record<RouteOption, string> = {
  "small-model": "Route to small model",
  "standard-model": "Route to standard model",
  "premium-model": "Route to premium model",
  "summarize-first": "Summarize first",
  "overnight-batch": "Run overnight batch",
};

interface RoutingPanelProps {
  request: FlaggedRequest;
  onClose: () => void;
  onSelectRoute: (route: RouteOption) => void;
  onSendBack: (option: RevisionOption) => void;
  /** When false, revision chips are non-interactive (POC / PDF click map) */
  revisionActionsEnabled?: boolean;
  /** Guided POC: only this route chip is clickable; others look normal but ignore input */
  demoOnlyRouteOption?: RouteOption;
  /** Drawer motion: open = slide up in; closing = slide down out */
  overlayPhase?: "open" | "closing";
}

export function RoutingPanel({
  request,
  onClose,
  onSelectRoute,
  onSendBack,
  revisionActionsEnabled = true,
  demoOnlyRouteOption,
  overlayPhase = "open",
}: RoutingPanelProps) {
  return (
    <div
      className={`routing-panel-overlay routing-panel-overlay--${overlayPhase}`}
      role="presentation"
    >
      <button
        type="button"
        className="routing-panel-overlay__backdrop"
        aria-label="Close routing panel"
        onClick={onClose}
      />
      <div
        className="routing-panel routing-panel--drawer"
        role="dialog"
        aria-labelledby="routing-panel-title"
      >
        <div className="routing-panel__drawer-inner">
          <header className="routing-panel__drawer-header">
            <h2 id="routing-panel-title" className="routing-panel__drawer-title">
              Edit routing
            </h2>
            <div className="routing-panel__drawer-close-wrap">
              <button
                type="button"
                className="routing-panel__close routing-panel__close--drawer link-button"
                onClick={onClose}
                aria-label="Close"
              >
                <CloseXSquareIcon />
              </button>
            </div>
          </header>

          <div className="routing-panel__drawer-body">
            <section className="routing-panel__drawer-group">
              <h3 className="routing-panel__drawer-group-title">Routing options</h3>
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
                          onSelectRoute(opt);
                          onClose();
                        }}
                      >
                        {PANEL_ROUTE_LABELS[opt]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="routing-panel__drawer-group">
              <h3 className="routing-panel__drawer-group-title">Request revision</h3>
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
                        onClose();
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
      </div>
    </div>
  );
}
