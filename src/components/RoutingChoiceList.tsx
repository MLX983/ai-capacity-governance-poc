import type { RevisionOption, RouteOption } from "../data/requests";
import { REVISION_LABELS } from "../data/requests";

export type RoutingChoice = RouteOption | RevisionOption;

export const ROUTE_OPTIONS: RouteOption[] = [
  "small-model",
  "standard-model",
  "premium-model",
  "summarize-first",
  "overnight-batch",
];

export const REVISION_OPTIONS: RevisionOption[] = ["narrow-scope", "split-tasks"];

/** Figma Screen 2 / Routing drawer (node 6115:734) */
export const PANEL_ROUTE_LABELS: Record<RouteOption, string> = {
  "small-model": "Route to small model",
  "standard-model": "Route to standard model",
  "premium-model": "Route to premium model",
  "summarize-first": "Summarize first",
  "overnight-batch": "Run overnight batch",
};

export function isRevisionChoice(
  choice: RoutingChoice,
): choice is RevisionOption {
  return choice === "narrow-scope" || choice === "split-tasks";
}

interface RoutingChoiceListProps {
  name: string;
  value: RoutingChoice | null;
  onChange: (choice: RoutingChoice) => void;
  onSave: () => void;
  onCancel: () => void;
  revisionEnabled?: boolean;
  demoOnlyRouteOption?: RouteOption;
}

export function RoutingChoiceList({
  name,
  value,
  onChange,
  onSave,
  onCancel,
  revisionEnabled = true,
  demoOnlyRouteOption,
}: RoutingChoiceListProps) {
  function routeLocked(opt: RouteOption): boolean {
    return demoOnlyRouteOption != null && opt !== demoOnlyRouteOption;
  }

  return (
    <form
      className="routing-choice-list"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <div
        className="routing-choice-list__options"
        role="radiogroup"
        aria-label="Routing decision"
      >
        <section className="routing-choice-list__group">
          <h3 className="routing-choice-list__heading">Routing options</h3>
          {ROUTE_OPTIONS.map((opt) => {
            const locked = routeLocked(opt);
            return (
              <label
                key={opt}
                className={
                  locked ? "routing-radio poc-action-guard" : "routing-radio"
                }
              >
                <input
                  type="radio"
                  className="routing-radio__input"
                  name={name}
                  value={opt}
                  checked={value === opt}
                  disabled={locked}
                  onChange={() => {
                    if (locked) return;
                    onChange(opt);
                  }}
                />
                <span className="routing-radio__control" aria-hidden="true" />
                <span className="routing-radio__label">
                  {PANEL_ROUTE_LABELS[opt]}
                </span>
              </label>
            );
          })}
        </section>

        <section className="routing-choice-list__group">
          <h3 className="routing-choice-list__heading">Request revision</h3>
          {REVISION_OPTIONS.map((opt) => {
            const locked = !revisionEnabled;
            return (
              <label
                key={opt}
                className={
                  locked ? "routing-radio poc-action-guard" : "routing-radio"
                }
              >
                <input
                  type="radio"
                  className="routing-radio__input"
                  name={name}
                  value={opt}
                  checked={value === opt}
                  disabled={locked}
                  onChange={() => {
                    if (locked) return;
                    onChange(opt);
                  }}
                />
                <span className="routing-radio__control" aria-hidden="true" />
                <span className="routing-radio__label">
                  {REVISION_LABELS[opt]}
                </span>
              </label>
            );
          })}
        </section>
      </div>

      <div className="routing-choice-list__actions">
        <button type="submit" className="routing-choice-list__save">
          Save
        </button>
        <button
          type="button"
          className="routing-choice-list__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
