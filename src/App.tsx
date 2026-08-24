import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PageShell } from "./components/PageShell";
import { isRevisionChoice } from "./components/RoutingChoiceList";
import {
  VIEW_TRANSITION_MS,
  salesOpsGuidedDemoComplete,
} from "./data/demoFlow";
import {
  INITIAL_REQUESTS,
  INITIAL_TEAMS,
  type FlaggedRequest,
  type RevisionOption,
  type RouteOption,
} from "./data/requests";
import { CapacityScreen } from "./screens/CapacityScreen";
import { FlaggedRequestsScreen } from "./screens/FlaggedRequestsScreen";
import { PremiumReviewScreen } from "./screens/PremiumReviewScreen";

type NavState =
  | { screen: "capacity" }
  | { screen: "flagged"; teamId: string }
  | { screen: "premium"; teamId: string; requestId: string };

type ScreenTransition = {
  from: NavState;
  to: NavState;
  direction: "forward" | "back";
  afterCommit?: () => void;
};

function navKey(n: NavState): string {
  if (n.screen === "capacity") return "cap";
  if (n.screen === "flagged") return `fl:${n.teamId}`;
  return `pr:${n.teamId}:${n.requestId}`;
}

function cloneInitialRequests(): FlaggedRequest[] {
  return INITIAL_REQUESTS.map((r) => ({
    ...r,
    premiumExpandedDetails: r.premiumExpandedDetails
      ? { ...r.premiumExpandedDetails }
      : undefined,
  }));
}

function App() {
  const [requests, setRequests] = useState<FlaggedRequest[]>(() =>
    cloneInitialRequests(),
  );
  const [nav, setNav] = useState<NavState>({ screen: "capacity" });
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [screenTransition, setScreenTransition] =
    useState<ScreenTransition | null>(null);

  useEffect(() => {
    if (!screenTransition) return;
    const pending = screenTransition;
    const id = window.setTimeout(() => {
      setNav(pending.to);
      pending.afterCommit?.();
      setScreenTransition(null);
    }, VIEW_TRANSITION_MS);
    return () => window.clearTimeout(id);
  }, [screenTransition]);

  const teamNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of INITIAL_TEAMS) m.set(t.id, t.name);
    return m;
  }, []);

  function pushTransition(next: ScreenTransition) {
    setScreenTransition((t) => (t ? t : next));
  }

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

  function setRequestRoute(
    requestId: string,
    route: RouteOption,
    options?: { completePremiumReview?: boolean },
  ) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const screen2RouteHeading =
          options?.completePremiumReview ||
          r.screen2RouteHeading === "selected" ||
          route !== r.recommendedRoute
            ? ("selected" as const)
            : undefined;
        return {
          ...r,
          selectedRoute: route,
          screen2RouteHeading,
          requiresPremiumReview: options?.completePremiumReview
            ? false
            : r.requiresPremiumReview,
        };
      }),
    );
  }

  const flaggedScreenProps = (teamId: string, contextNav: NavState) => ({
    teamId,
    requests,
    editingRequestId,
    onOpenEdit: (id: string) => setEditingRequestId(id),
    onCloseEdit: () => setEditingRequestId(null),
    onSelectRoute: (id: string, route: RouteOption) =>
      setRequestRoute(id, route),
    onSendBack: (id: string, _revision: RevisionOption) => {
      sendBackRequest(id);
      setEditingRequestId(null);
    },
    onApprove: (id: string) => approveRequest(id),
    onOpenPremium: (requestId: string) => {
      setEditingRequestId(null);
      pushTransition({
        from: contextNav,
        to: { screen: "premium", teamId, requestId },
        direction: "forward",
      });
    },
  });

  function renderNavContent(n: NavState): ReactNode {
    const premiumRequest =
      n.screen === "premium"
        ? requests.find((r) => r.id === n.requestId)
        : undefined;

    if (n.screen === "capacity") {
      return (
        <PageShell variant="capacity" title="AI Capacity Review">
          <CapacityScreen
            teams={INITIAL_TEAMS}
            requests={requests}
            interactiveTeamId="sales-ops"
            onNavigateToFlagged={(teamId) => {
              pushTransition({
                from: n,
                to: { screen: "flagged", teamId },
                direction: "forward",
              });
            }}
          />
        </PageShell>
      );
    }

    if (n.screen === "flagged") {
      const fp = flaggedScreenProps(n.teamId, n);
      return (
        <PageShell
          variant="flagged"
          title="Flagged requests"
          subtitle={teamNameById.get(n.teamId) ?? n.teamId}
          onBack={() => {
            const reset =
              n.teamId === "sales-ops" &&
              salesOpsGuidedDemoComplete(requests);
            pushTransition({
              from: n,
              to: { screen: "capacity" },
              direction: "back",
              afterCommit: () => {
                setEditingRequestId(null);
                if (reset) {
                  setRequests(cloneInitialRequests());
                }
              },
            });
          }}
        >
          <FlaggedRequestsScreen
            teamId={fp.teamId}
            requests={fp.requests}
            editingRequestId={fp.editingRequestId}
            onOpenEdit={fp.onOpenEdit}
            onCloseEdit={fp.onCloseEdit}
            onSelectRoute={fp.onSelectRoute}
            onSendBack={fp.onSendBack}
            onApprove={fp.onApprove}
            onOpenPremium={fp.onOpenPremium}
          />
        </PageShell>
      );
    }

    if (n.screen === "premium" && premiumRequest) {
      return (
        <PageShell
          variant="premium"
          title="Review premium route"
          onBack={() => {
            pushTransition({
              from: n,
              to: { screen: "flagged", teamId: n.teamId },
              direction: "back",
              afterCommit: () => setEditingRequestId(null),
            });
          }}
        >
          <PremiumReviewScreen
            request={premiumRequest}
            onSave={(choice) => {
              if (isRevisionChoice(choice)) {
                sendBackRequest(premiumRequest.id);
              } else {
                setRequestRoute(premiumRequest.id, choice, {
                  completePremiumReview: true,
                });
              }
              pushTransition({
                from: n,
                to: { screen: "flagged", teamId: n.teamId },
                direction: "back",
                afterCommit: () => setEditingRequestId(null),
              });
            }}
            onCancel={() => {
              pushTransition({
                from: n,
                to: { screen: "flagged", teamId: n.teamId },
                direction: "back",
                afterCommit: () => setEditingRequestId(null),
              });
            }}
          />
        </PageShell>
      );
    }

    return (
      <PageShell
        title="Review premium route"
        onBack={() => setNav({ screen: "capacity" })}
      >
        <p className="empty-state">That request is no longer in the queue.</p>
      </PageShell>
    );
  }

  return (
    <div className="app-root">
      {!screenTransition ? (
        <div className="view-stack view-stack--idle">
          <div
            key={navKey(nav)}
            className="view-stack-panel view-stack-panel--current"
          >
            {renderNavContent(nav)}
          </div>
        </div>
      ) : (
        <div
          className={`view-stack view-stack--transitioning view-stack--${screenTransition.direction}`}
        >
          <div
            key={navKey(screenTransition.from)}
            className="view-stack-panel view-stack-panel--from"
          >
            {renderNavContent(screenTransition.from)}
          </div>
          <div
            key={navKey(screenTransition.to)}
            className="view-stack-panel view-stack-panel--to"
          >
            {renderNavContent(screenTransition.to)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
