import "./IconButton.css";

// Atom: a small round button that only shows a symbol, for example "✕" or "☰".
// - icon: the symbol to show
// - label: the text shown in the tooltip when the mouse is over the button
// - active: shows the "selected" style (used for the watchlist bookmark)
function IconButton({ icon, label, onClick, disabled = false, active = false }) {
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
      title={label}
    >
      {icon}
    </button>
  );
}

export default IconButton;
