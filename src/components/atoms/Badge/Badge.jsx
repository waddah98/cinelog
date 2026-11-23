import "./Badge.css";

// Atom: a small label for genres, statuses or other short information.
// - variant: "default" | "genre" | "planned" | "watched" | "rating"
function Badge({ children, variant = "default" }) {
  return <span className={"badge badge--" + variant}>{children}</span>;
}

export default Badge;
