import "./Button.css";

// Atom: a standard button.
// - variant: "primary" | "secondary" | "danger" | "ghost"  (changes the colors)
// - size: "small" | "medium" | "large"
// - children: the text inside the button
function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  onClick,
}) {
  // Build the CSS class list from the props, for example "button button--primary button--medium".
  const className = "button button--" + variant + " button--" + size;

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
