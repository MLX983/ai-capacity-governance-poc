import type { TeamCapacity } from "../data/requests";

interface CapacityCardProps {
  team: TeamCapacity;
  flaggedCount: number;
  onReviewFlagged?: () => void;
}

export function CapacityCard({
  team,
  flaggedCount,
  onReviewFlagged,
}: CapacityCardProps) {
  const overAllocation = team.usedPercent >= 100;
  return (
    <article className="capacity-card">
      <h2 className="capacity-card__name">{team.name}</h2>
      <p className="capacity-card__meta">{team.weeklyAllocationLabel}</p>
      <p className="capacity-card__usage">
        Used: {team.usedPercent}% · {team.trendLabel}
      </p>
      {flaggedCount > 0 && onReviewFlagged ? (
        <p className="capacity-card__actions">
          <button type="button" className="text-link" onClick={onReviewFlagged}>
            Review {flaggedCount} flagged request
            {flaggedCount === 1 ? "" : "s"}
          </button>
        </p>
      ) : (
        <p className="capacity-card__muted">No flagged requests</p>
      )}
      {overAllocation && flaggedCount > 0 ? (
        <p className="capacity-card__hint">
          Capacity pressure — review queue before additional premium routes.
        </p>
      ) : null}
    </article>
  );
}
