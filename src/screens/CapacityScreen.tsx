import { CapacityCard } from "../components/CapacityCard";
import type { FlaggedRequest, TeamCapacity } from "../data/requests";
import { queuedRequestsForTeam } from "../data/requests";

interface CapacityScreenProps {
  teams: TeamCapacity[];
  requests: FlaggedRequest[];
  /** Only this team’s “Review flagged” control is clickable (Screenshots PDF) */
  interactiveTeamId: string;
  onNavigateToFlagged: (teamId: string) => void;
}

export function CapacityScreen({
  teams,
  requests,
  interactiveTeamId,
  onNavigateToFlagged,
}: CapacityScreenProps) {
  return (
    <div className="capacity-screen">
      <ul className="card-list card-list--capacity">
        {teams.map((team) => {
          const count = queuedRequestsForTeam(requests, team.id).length;
          const linkEnabled =
            team.id === interactiveTeamId && count > 0;
          return (
            <li key={team.id}>
              <CapacityCard
                team={team}
                flaggedCount={count}
                reviewLinkEnabled={linkEnabled}
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
