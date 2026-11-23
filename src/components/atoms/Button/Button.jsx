import "./Button.css";

// Atom: a standard button.
// - variant: "primary" | "secondary" | "danger" | "ghost"  (changes the colors)
// - size: "small" | "medium" | "large"
// - children: the content inside the button (text, and optionally an icon)
function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  onClick,
  ariaPressed,
}) {
  // Build the CSS class list from the props, for example "button button--primary button--medium".
  const className = "button button--" + variant + " button--" + size;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}

export default Button;
