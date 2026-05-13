import type { ReactNode } from "react";
import { CaretLeftIcon } from "./CaretLeftIcon";

interface PageShellProps {
  title: string;
  subtitle?: string;
  /** Screen 1 (Figma): Instrument title, no header rule */
  variant?: "default" | "capacity" | "flagged" | "premium";
  onBack?: () => void;
  children: ReactNode;
}

export function PageShell({
  title,
  subtitle,
  variant = "default",
  onBack,
  children,
}: PageShellProps) {
  const rootClass =
    variant === "capacity"
      ? "page-shell page-shell--capacity"
      : variant === "flagged"
        ? "page-shell page-shell--flagged"
        : variant === "premium"
          ? "page-shell page-shell--premium"
          : "page-shell";

  const titleInstrument =
    variant === "capacity" ||
    variant === "flagged" ||
    variant === "premium"
      ? "page-shell__title page-shell__title--instrument"
      : "page-shell__title";

  const useCaretHeader =
    (variant === "flagged" || variant === "premium") && onBack;

  return (
    <div className={rootClass}>
      <header className="page-shell__header">
        {useCaretHeader ? (
          <>
            <div className="page-shell__title-row page-shell__title-row--flagged">
              <button
                type="button"
                className="page-shell__back-icon link-button"
                onClick={onBack}
                aria-label="Back"
              >
                <CaretLeftIcon />
              </button>
              <h1 className={titleInstrument}>{title}</h1>
            </div>
            {variant === "flagged" && subtitle ? (
              <p className="page-shell__subtitle page-shell__subtitle--flagged">
                {subtitle}
              </p>
            ) : null}
          </>
        ) : (
          <>
            {onBack ? (
              <button
                type="button"
                className="page-shell__back link-button"
                onClick={onBack}
              >
                <span className="page-shell__back-arrow" aria-hidden>
                  ←
                </span>
                <span>Back</span>
              </button>
            ) : null}
            <h1 className={titleInstrument}>{title}</h1>
            {subtitle ? <p className="page-shell__subtitle">{subtitle}</p> : null}
          </>
        )}
      </header>
      <main className="page-shell__main">{children}</main>
    </div>
  );
}
