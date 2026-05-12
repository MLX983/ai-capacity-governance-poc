import type { FlaggedRequest } from "../data/requests";
import { ROUTE_LABELS } from "../data/requests";

interface RequestCardProps {
  request: FlaggedRequest;
  onApprove: () => void;
  onEditRoute: () => void;
  onOpenPremiumReview?: () => void;
}

export function RequestCard({
  request,
  onApprove,
  onEditRoute,
  onOpenPremiumReview,
}: RequestCardProps) {
  const routeLabel = ROUTE_LABELS[request.selectedRoute];
  const differs =
    request.selectedRoute !== request.recommendedRoute;

  return (
    <article className="request-card">
      <h2 className="request-card__title">{request.title}</h2>
      <p className="request-card__meta">
        {request.requestor} · {request.estimatedUseLabel}
      </p>
      <p className="request-card__route">
        Route: {routeLabel}
        {differs ? (
          <span className="request-card__badge"> updated</span>
        ) : null}
      </p>
      <p className="request-card__flag">{request.flagReason}</p>
      <div className="request-card__actions">
        {request.requiresPremiumReview ? (
          <button
            type="button"
            className="button button--primary"
            onClick={onOpenPremiumReview}
          >
            {"Review premium route >"}
          </button>
        ) : (
          <>
            <button type="button" className="button" onClick={onEditRoute}>
              Edit route
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={onApprove}
            >
              Approve route
            </button>
          </>
        )}
      </div>
    </article>
  );
}
