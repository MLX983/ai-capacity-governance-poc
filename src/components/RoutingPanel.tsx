import { useState } from "react";
import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { CloseXSquareIcon } from "./CloseXSquareIcon";
import {
  RoutingChoiceList,
  isRevisionChoice,
  type RoutingChoice,
} from "./RoutingChoiceList";

interface RoutingPanelProps {
  request: FlaggedRequest;
  onClose: () => void;
  onSelectRoute: (route: RouteOption) => void;
  onSendBack: (option: RevisionOption) => void;
  /** When false, revision radios are non-interactive (POC / PDF click map) */
  revisionActionsEnabled?: boolean;
  /** Guided POC: only this route radio is clickable; others look normal but ignore input */
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
  const [pendingChoice, setPendingChoice] = useState<RoutingChoice>(
    request.selectedRoute,
  );

  function commitPending() {
    if (isRevisionChoice(pendingChoice)) {
      onSendBack(pendingChoice);
    } else {
      onSelectRoute(pendingChoice);
    }
    onClose();
  }

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
            <RoutingChoiceList
              name="edit-routing"
              value={pendingChoice}
              onChange={setPendingChoice}
              onSave={commitPending}
              onCancel={onClose}
              revisionEnabled={revisionActionsEnabled}
              demoOnlyRouteOption={demoOnlyRouteOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
