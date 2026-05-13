import type { TeamCapacity } from "../data/requests";
import { WarningDiamondIcon } from "./WarningDiamondIcon";

interface CapacityCardProps {
  team: TeamCapacity;
  flaggedCount: number;
  /** When false, “Review … flagged” looks normal but does not navigate */
  reviewLinkEnabled: boolean;
  onReviewFlagged?: () => void;
}

export function CapacityCard({
  team,
  flaggedCount,
  reviewLinkEnabled,
  onReviewFlagged,
}: CapacityCardProps) {
  const usageWarn = team.usageWarning === true;
  const trendWarn = team.trendWarning === true;

  return (
    <article className="capacity-card">
      <h2 className="capacity-card__name">{team.name}</h2>
      <p
        className={
          usageWarn
            ? "capacity-card__line capacity-card__line--strong"
            : "capacity-card__line"
        }
      >
        {usageWarn ? <WarningDiamondIcon /> : null}
        <span>Usage: {team.usedPercent}%</span>
      </p>
      <p
        className={
          trendWarn
            ? "capacity-card__line capacity-card__line--strong"
            : "capacity-card__line"
        }
      >
        {trendWarn ? <WarningDiamondIcon /> : null}
        <span>Trend: {team.trendLabel}</span>
      </p>
      {team.weeklyAllocationLabel ? (
        <p className="capacity-card__allocation">{team.weeklyAllocationLabel}</p>
      ) : null}
      {flaggedCount > 0 ? (
        <p className="capacity-card__actions">
          <button
            type="button"
            className={
              reviewLinkEnabled
                ? "capacity-card__link"
                : "capacity-card__link poc-action-guard"
            }
            aria-disabled={!reviewLinkEnabled}
            tabIndex={reviewLinkEnabled ? undefined : -1}
            onClick={() => {
              if (!reviewLinkEnabled) return;
              onReviewFlagged?.();
            }}
          >
            Review {flaggedCount} flagged request{flaggedCount === 1 ? "" : "s"}{" "}
            &gt;
          </button>
        </p>
      ) : (
        <p className="capacity-card__muted">No flagged requests</p>
      )}
    </article>
  );
}
