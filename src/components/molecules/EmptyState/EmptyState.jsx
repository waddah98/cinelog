import { Inbox } from "lucide-react";
import Button from "../../atoms/Button/Button";
import "./EmptyState.css";

// Molecule: shown when a list has nothing to display.
// - icon: optional Lucide icon element (an inbox icon is used by default)
// - actionLabel + onAction: optional button, for example "Clear filters"
function EmptyState({ icon, title, message, actionLabel, onAction }) {
  let shownIcon = icon;
  if (!shownIcon) {
    shownIcon = <Inbox size={40} />;
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {shownIcon}
      </div>
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
