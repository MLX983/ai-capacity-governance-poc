import type { FlaggedRequest } from "../data/requests";
import { ROUTE_LABELS } from "../data/requests";

interface RequestCardProps {
  request: FlaggedRequest;
  /** PDF: only marked controls work in the POC (visual style unchanged) */
  editEnabled: boolean;
  approveEnabled: boolean;
  premiumLinkEnabled: boolean;
  onApprove: () => void;
  onEditRoute: () => void;
  onOpenPremiumReview?: () => void;
}

export function RequestCard({
  request,
  editEnabled,
  approveEnabled,
  premiumLinkEnabled,
  onApprove,
  onEditRoute,
  onOpenPremiumReview,
}: RequestCardProps) {
  const routeLabel = ROUTE_LABELS[request.selectedRoute];
  const differs = request.selectedRoute !== request.recommendedRoute;
  const routeHeading =
    request.screen2RouteHeading === "selected"
      ? "Selected route"
      : "Recommended route";
  const routeLineStrong =
    request.selectedRoute === "premium-model" ||
    request.screen2RouteHeading === "selected";

  return (
    <article className="request-card request-card--screen2">
      <h2 className="request-card__title">{request.title}</h2>
      <div className="request-card__meta-block">
        <p className="request-card__meta-line">
          Requested by: {request.requestor}
        </p>
        <p className="request-card__meta-line">
          Estimated use: {request.estimatedUseLabel}
        </p>
      </div>
      <p
        className={
          routeLineStrong
            ? "request-card__route-line request-card__route-line--strong"
            : "request-card__route-line"
        }
      >
        {routeHeading}: {routeLabel}
        {differs && request.screen2RouteHeading !== "selected" ? (
          <span className="request-card__badge"> updated</span>
        ) : null}
      </p>
      <div className="request-card__actions request-card__actions--screen2">
        {request.requiresPremiumReview ? (
          <button
            type="button"
            className={
              premiumLinkEnabled
                ? "request-card__premium-link"
                : "request-card__premium-link poc-action-guard"
            }
            aria-disabled={!premiumLinkEnabled}
            tabIndex={premiumLinkEnabled ? undefined : -1}
            onClick={() => {
              if (!premiumLinkEnabled) return;
              onOpenPremiumReview?.();
            }}
          >
            {"Review premium route >"}
          </button>
        ) : (
          <>
            <button
              type="button"
              className={
                approveEnabled
                  ? "request-card__btn request-card__btn--approve"
                  : "request-card__btn request-card__btn--approve poc-action-guard"
              }
              aria-disabled={!approveEnabled}
              tabIndex={approveEnabled ? undefined : -1}
              onClick={() => {
                if (!approveEnabled) return;
                onApprove();
              }}
            >
              Approve
            </button>
            <button
              type="button"
              className={
                editEnabled
                  ? "request-card__btn request-card__btn--edit"
                  : "request-card__btn request-card__btn--edit poc-action-guard"
              }
              aria-disabled={!editEnabled}
              tabIndex={editEnabled ? undefined : -1}
              onClick={() => {
                if (!editEnabled) return;
                onEditRoute();
              }}
            >
              Edit
            </button>
          </>
        )}
      </div>
    </article>
  );
}
