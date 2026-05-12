import { CapacityCard } from "../components/CapacityCard";
import type { FlaggedRequest, TeamCapacity } from "../data/requests";
import { queuedRequestsForTeam } from "../data/requests";

interface CapacityScreenProps {
  teams: TeamCapacity[];
  requests: FlaggedRequest[];
  onNavigateToFlagged: (teamId: string) => void;
}

export function CapacityScreen({
  teams,
  requests,
  onNavigateToFlagged,
}: CapacityScreenProps) {
  return (
    <div className="stack">
      <p className="lede">
        Weekly allocations and teams under capacity pressure. Open flagged
        queues to review routing before additional compute is used.
      </p>
      <ul className="card-list">
        {teams.map((team) => {
          const count = queuedRequestsForTeam(requests, team.id).length;
          return (
            <li key={team.id}>
              <CapacityCard
                team={team}
                flaggedCount={count}
                onReviewFlagged={
                  count > 0 ? () => onNavigateToFlagged(team.id) : undefined
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
