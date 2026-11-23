import "./IconButton.css";

// Atom: a button that only shows an icon.
// Because there is no visible text, the "label" prop is required:
// it becomes the aria-label (read by screen readers) and the tooltip (title).
// - icon: a Lucide icon element, for example <X size={18} />
// - active: shows the "selected" style (used for the watchlist bookmark)
// - ariaExpanded: optional, tells screen readers if a menu opened by this button is open
function IconButton({ icon, label, onClick, disabled = false, active = false, ariaExpanded }) {
  let className = "icon-button";
  if (active) {
    className = className + " icon-button--active";
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-expanded={ariaExpanded}
    >
      {icon}
    </button>
  );
}

export default IconButton;
