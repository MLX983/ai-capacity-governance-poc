import { useMemo, useState } from "react";
import { PageShell } from "./components/PageShell";
import {
  INITIAL_REQUESTS,
  INITIAL_TEAMS,
  type FlaggedRequest,
  type RouteOption,
} from "./data/requests";
import { CapacityScreen } from "./screens/CapacityScreen";
import { FlaggedRequestsScreen } from "./screens/FlaggedRequestsScreen";
import { PremiumReviewScreen } from "./screens/PremiumReviewScreen";

type NavState =
  | { screen: "capacity" }
  | { screen: "flagged"; teamId: string }
  | { screen: "premium"; teamId: string; requestId: string };

function App() {
  const [requests, setRequests] = useState<FlaggedRequest[]>(INITIAL_REQUESTS);
  const [nav, setNav] = useState<NavState>({ screen: "capacity" });
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);

  const teamNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of INITIAL_TEAMS) m.set(t.id, t.name);
    return m;
  }, []);

  function approveRequest(requestId: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "approved" as const } : r,
      ),
    );
    setEditingRequestId(null);
  }

  function sendBackRequest(requestId: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: "sent-back" as const } : r,
      ),
    );
    setEditingRequestId(null);
  }

  function setRequestRoute(requestId: string, route: RouteOption) {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, selectedRoute: route } : r)),
    );
  }

  const premiumRequest =
    nav.screen === "premium"
      ? requests.find((r) => r.id === nav.requestId)
      : undefined;

  return (
    <div className="app-root">
      {nav.screen === "capacity" ? (
        <PageShell title="AI capacity by team">
          <CapacityScreen
            teams={INITIAL_TEAMS}
            requests={requests}
            onNavigateToFlagged={(teamId) => {
              setNav({ screen: "flagged", teamId });
              setEditingRequestId(null);
            }}
          />
        </PageShell>
      ) : null}

      {nav.screen === "flagged" ? (
        <PageShell
          title="Flagged requests"
          onBack={() => {
            setNav({ screen: "capacity" });
            setEditingRequestId(null);
          }}
        >
          <FlaggedRequestsScreen
            teamId={nav.teamId}
            teamName={teamNameById.get(nav.teamId) ?? nav.teamId}
            requests={requests}
            editingRequestId={editingRequestId}
            onOpenEdit={(id) => setEditingRequestId(id)}
            onCloseEdit={() => setEditingRequestId(null)}
            onSelectRoute={(id, route) => setRequestRoute(id, route)}
            onSendBack={(id, _revision) => {
              sendBackRequest(id);
              setEditingRequestId(null);
            }}
            onApprove={(id) => approveRequest(id)}
            onOpenPremium={(requestId) => {
              setEditingRequestId(null);
              setNav({
                screen: "premium",
                teamId: nav.teamId,
                requestId,
              });
            }}
          />
        </PageShell>
      ) : null}

      {nav.screen === "premium" && premiumRequest ? (
        <PageShell
          title="Premium route review"
          onBack={() => {
            setNav({ screen: "flagged", teamId: nav.teamId });
            setEditingRequestId(null);
          }}
        >
          <PremiumReviewScreen
            request={premiumRequest}
            onBack={() => {
              setNav({ screen: "flagged", teamId: nav.teamId });
            }}
            onSelectRoute={(route) => setRequestRoute(premiumRequest.id, route)}
            onApprove={() => {
              approveRequest(premiumRequest.id);
              setNav({ screen: "flagged", teamId: nav.teamId });
            }}
            onSendBack={(_revision) => {
              sendBackRequest(premiumRequest.id);
              setNav({ screen: "flagged", teamId: nav.teamId });
            }}
          />
        </PageShell>
      ) : null}

      {nav.screen === "premium" && !premiumRequest ? (
        <PageShell
          title="Premium route review"
          onBack={() => setNav({ screen: "capacity" })}
        >
          <p className="empty-state">That request is no longer in the queue.</p>
        </PageShell>
      ) : null}
    </div>
  );
}

export default App;
