import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { RequestCard } from "../components/RequestCard";
import { RoutingPanel } from "../components/RoutingPanel";
import {
  REQUEST_CARD_FADE_MS,
  REQUEST_LIST_FLIP_MS,
  SALES_OPS_EXECUTIVE_BRIEFING_ID,
  SALES_OPS_SCREEN2_DEMO_CARD_ID,
} from "../data/demoFlow";
import type { FlaggedRequest, RevisionOption, RouteOption } from "../data/requests";
import { queuedRequestsForTeam } from "../data/requests";

/** Drawer slide animation duration (see `routing-drawer-*` in app.css) */
const ROUTING_DRAWER_MS = 450;

interface FlaggedRequestsScreenProps {
  teamId: string;
  requests: FlaggedRequest[];
  editingRequestId: string | null;
  /** Increment to run the same exit animation as the demo top card for the executive briefing row */
  exitExecutiveBriefingSignal?: number;
  onOpenEdit: (requestId: string) => void;
  onCloseEdit: () => void;
  onSelectRoute: (requestId: string, route: RouteOption) => void;
  onSendBack: (requestId: string, revision: RevisionOption) => void;
  onApprove: (requestId: string) => void;
  onOpenPremium: (requestId: string) => void;
}

function interactionForRequest(
  request: FlaggedRequest,
  teamId: string,
  allRequests: FlaggedRequest[],
): { edit: boolean; approve: boolean; premium: boolean } {
  if (teamId !== "sales-ops") {
    return { edit: false, approve: false, premium: false };
  }

  const demoTopStillQueued = allRequests.some(
    (r) =>
      r.id === SALES_OPS_SCREEN2_DEMO_CARD_ID && r.status === "queued",
  );

  if (request.id === SALES_OPS_SCREEN2_DEMO_CARD_ID) {
    const initial =
      request.recommendedRoute === "overnight-batch" &&
      request.selectedRoute === "overnight-batch" &&
      request.screen2RouteHeading !== "selected";
    const afterRouteChange =
      request.screen2RouteHeading === "selected" &&
      request.selectedRoute === "small-model";
    return {
      edit: initial,
      approve: afterRouteChange,
      premium: false,
    };
  }

  if (
    request.id === SALES_OPS_EXECUTIVE_BRIEFING_ID &&
    request.requiresPremiumReview &&
    !demoTopStillQueued
  ) {
    return { edit: false, approve: false, premium: true };
  }

  return { edit: false, approve: false, premium: false };
}

const EXIT_ANIM_IDS = new Set([
  SALES_OPS_SCREEN2_DEMO_CARD_ID,
  SALES_OPS_EXECUTIVE_BRIEFING_ID,
]);

type PendingFlip = {
  nonce: number;
  firstRects: Map<string, DOMRect>;
};

export function FlaggedRequestsScreen({
  teamId,
  requests,
  editingRequestId,
  exitExecutiveBriefingSignal = 0,
  onOpenEdit,
  onCloseEdit,
  onSelectRoute,
  onSendBack,
  onApprove,
  onOpenPremium,
}: FlaggedRequestsScreenProps) {
  const list = queuedRequestsForTeam(requests, teamId);
  const listIds = list.map((r) => r.id).join("\n");
  const editing = editingRequestId
    ? requests.find((r) => r.id === editingRequestId)
    : undefined;

  const [drawerClosing, setDrawerClosing] = useState(false);
  const [fadingId, setFadingId] = useState<string | null>(null);
  const [listFlipClipActive, setListFlipClipActive] = useState(false);
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecutiveExitSignal = useRef(0);

  const listUlRef = useRef<HTMLUListElement | null>(null);
  const flipNonceRef = useRef(0);
  const pendingFlipRef = useRef<PendingFlip | null>(null);
  const finishedFlipNoncesRef = useRef<Set<number>>(new Set());
  const flipCleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const flipRafRef = useRef<number | null>(null);

  const clearRemoveTimer = useCallback(() => {
    if (removeTimerRef.current != null) {
      window.clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
  }, []);

  const clearFlipTimers = useCallback(() => {
    if (flipCleanupTimerRef.current != null) {
      window.clearTimeout(flipCleanupTimerRef.current);
      flipCleanupTimerRef.current = null;
    }
    if (flipRafRef.current != null) {
      cancelAnimationFrame(flipRafRef.current);
      flipRafRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    const pending = pendingFlipRef.current;
    if (!pending) return;
    if (finishedFlipNoncesRef.current.has(pending.nonce)) return;
    finishedFlipNoncesRef.current.add(pending.nonce);
    pendingFlipRef.current = null;

    const ul = listUlRef.current;
    if (!ul) return;

    const targets: { el: HTMLElement; dy: number }[] = [];
    for (const [rid, first] of pending.firstRects) {
      const li = ul.querySelector(
        `li[data-request-id="${CSS.escape(rid)}"]`,
      ) as HTMLElement | null;
      if (!li) continue;
      const last = li.getBoundingClientRect();
      const dy = first.top - last.top;
      if (Math.abs(dy) < 1) continue;
      targets.push({ el: li, dy });
      li.style.transition = "none";
      li.style.transform = `translateY(${dy}px)`;
    }

    if (targets.length === 0) return;

    setListFlipClipActive(true);
    clearFlipTimers();
    flipRafRef.current = requestAnimationFrame(() => {
      flipRafRef.current = null;
      const flipMs = REQUEST_LIST_FLIP_MS;
      for (const { el } of targets) {
        el.style.transition = `transform ${flipMs}ms ease`;
        el.style.transform = "translateY(0)";
      }
      flipCleanupTimerRef.current = window.setTimeout(() => {
        flipCleanupTimerRef.current = null;
        for (const { el } of targets) {
          el.style.transition = "";
          el.style.transform = "";
        }
        setListFlipClipActive(false);
      }, flipMs + 80);
    });

    return () => {
      clearFlipTimers();
      setListFlipClipActive(false);
    };
  }, [listIds, clearFlipTimers]);

  const scheduleApproveExit = useCallback(
    (id: string) => {
      if (!EXIT_ANIM_IDS.has(id)) {
        onApprove(id);
        return;
      }
      const queued = queuedRequestsForTeam(requests, teamId);
      if (!queued.some((r) => r.id === id)) return;
      clearRemoveTimer();
      setFadingId(id);
      removeTimerRef.current = window.setTimeout(() => {
        removeTimerRef.current = null;
        const ul = listUlRef.current;
        const firstRects = new Map<string, DOMRect>();
        if (ul) {
          for (const li of ul.querySelectorAll(":scope > li[data-request-id]")) {
            const el = li as HTMLElement;
            const rid = el.dataset.requestId;
            if (rid && rid !== id) {
              firstRects.set(rid, el.getBoundingClientRect());
            }
          }
        }
        flipNonceRef.current += 1;
        pendingFlipRef.current = {
          nonce: flipNonceRef.current,
          firstRects,
        };
        onApprove(id);
        setFadingId(null);
      }, REQUEST_CARD_FADE_MS);
    },
    [requests, teamId, onApprove, clearRemoveTimer],
  );

  useEffect(() => {
    return () => {
      clearRemoveTimer();
      clearFlipTimers();
    };
  }, [clearRemoveTimer, clearFlipTimers]);

  useEffect(() => {
    if (exitExecutiveBriefingSignal === 0) {
      lastExecutiveExitSignal.current = 0;
    }
  }, [exitExecutiveBriefingSignal]);

  useEffect(() => {
    if (exitExecutiveBriefingSignal <= lastExecutiveExitSignal.current) return;
    const queued = queuedRequestsForTeam(requests, teamId);
    if (!queued.some((r) => r.id === SALES_OPS_EXECUTIVE_BRIEFING_ID)) return;
    lastExecutiveExitSignal.current = exitExecutiveBriefingSignal;
    scheduleApproveExit(SALES_OPS_EXECUTIVE_BRIEFING_ID);
  }, [exitExecutiveBriefingSignal, requests, teamId, scheduleApproveExit]);

  function closeDrawerAnimated() {
    setDrawerClosing(true);
    window.setTimeout(() => {
      setDrawerClosing(false);
      onCloseEdit();
    }, ROUTING_DRAWER_MS);
  }

  return (
    <div className="flagged-screen">
      {list.length === 0 ? (
        <p className="empty-state">No items in the active review queue.</p>
      ) : (
        <div
          className={
            listFlipClipActive
              ? "flagged-screen__list-wrap flagged-screen__list-wrap--flip-clip"
              : "flagged-screen__list-wrap"
          }
        >
          <ul ref={listUlRef} className="card-list card-list--flagged">
            {list.map((req) => {
              const ix = interactionForRequest(req, teamId, requests);
              const fading = fadingId === req.id;
              return (
                <li
                  key={req.id}
                  data-request-id={req.id}
                  className={fading ? "card-list__item--fading" : undefined}
                >
                  <div className="card-list__item-inner">
                    <RequestCard
                      request={req}
                      editEnabled={ix.edit}
                      approveEnabled={ix.approve}
                      premiumLinkEnabled={ix.premium}
                      onApprove={() => scheduleApproveExit(req.id)}
                      onEditRoute={() => {
                        if (ix.edit) onOpenEdit(req.id);
                      }}
                      onOpenPremiumReview={
                        ix.premium && req.requiresPremiumReview
                          ? () => onOpenPremium(req.id)
                          : undefined
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {editing ? (
        <RoutingPanel
          overlayPhase={drawerClosing ? "closing" : "open"}
          request={editing}
          onClose={closeDrawerAnimated}
          onSelectRoute={(route) => onSelectRoute(editing.id, route)}
          onSendBack={(opt) => onSendBack(editing.id, opt)}
          revisionActionsEnabled={
            editing.id !== SALES_OPS_SCREEN2_DEMO_CARD_ID
          }
          demoOnlyRouteOption={
            editing.id === SALES_OPS_SCREEN2_DEMO_CARD_ID
              ? "small-model"
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
