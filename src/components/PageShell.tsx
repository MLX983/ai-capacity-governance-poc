import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  onBack?: () => void;
  children: ReactNode;
}

export function PageShell({ title, onBack, children }: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="page-shell__header">
        {onBack ? (
          <button type="button" className="link-button" onClick={onBack}>
            Back
          </button>
        ) : (
          <span className="page-shell__header-spacer" />
        )}
        <h1 className="page-shell__title">{title}</h1>
        <span className="page-shell__header-spacer" />
      </header>
      <main className="page-shell__main">{children}</main>
    </div>
  );
}
