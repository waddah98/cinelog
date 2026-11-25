import Button from "../../atoms/Button/Button";
import "./EmptyState.css";

// Molecule: shown when a list has nothing to display.
// - icon: optional symbol shown in the circle (an empty mailbox by default)
// - actionLabel + onAction: optional button, for example "Clear filters"
function EmptyState({ icon = "📭", title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
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
