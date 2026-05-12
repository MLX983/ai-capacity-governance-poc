import { RequestCard } from "../components/RequestCard";
import { RoutingPanel } from "../components/RoutingPanel";
import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { queuedRequestsForTeam } from "../data/requests";

interface FlaggedRequestsScreenProps {
  teamName: string;
  teamId: string;
  requests: FlaggedRequest[];
  editingRequestId: string | null;
  onOpenEdit: (requestId: string) => void;
  onCloseEdit: () => void;
  onSelectRoute: (requestId: string, route: RouteOption) => void;
  onSendBack: (requestId: string, revision: RevisionOption) => void;
  onApprove: (requestId: string) => void;
  onOpenPremium: (requestId: string) => void;
}

export function FlaggedRequestsScreen({
  teamName,
  teamId,
  requests,
  editingRequestId,
  onOpenEdit,
  onCloseEdit,
  onSelectRoute,
  onSendBack,
  onApprove,
  onOpenPremium,
}: FlaggedRequestsScreenProps) {
  const list = queuedRequestsForTeam(requests, teamId);
  const editing = editingRequestId
    ? requests.find((r) => r.id === editingRequestId)
    : undefined;

  return (
    <div className="stack">
      <p className="lede">
        Flagged requests for <strong>{teamName}</strong>. Approve the current
        route, pick a lower-cost path, or send work back for revision. Premium
        items require the detail review first.
      </p>
      {list.length === 0 ? (
        <p className="empty-state">No items in the active review queue.</p>
      ) : (
        <ul className="card-list">
          {list.map((req) => (
            <li key={req.id}>
              <RequestCard
                request={req}
                onApprove={() => onApprove(req.id)}
                onEditRoute={() => onOpenEdit(req.id)}
                onOpenPremiumReview={
                  req.requiresPremiumReview
                    ? () => onOpenPremium(req.id)
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
      {editing ? (
        <RoutingPanel
          request={editing}
          onClose={onCloseEdit}
          onSelectRoute={(route) => onSelectRoute(editing.id, route)}
          onSendBack={(opt) => onSendBack(editing.id, opt)}
        />
      ) : null}
    </div>
  );
}
