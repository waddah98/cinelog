import { Star } from "lucide-react";
import "./Rating.css";

// Atom: shows a movie rating with a star icon, for example "★ 8.8 /10".
// - value: the rating number
// - max: the highest possible rating (10 by default)
// - showValue: when false, only the star is shown
function Rating({ value, max = 10, showValue = true }) {
  // toFixed(1) always shows one decimal: 9 becomes "9.0".
  const displayValue = Number(value).toFixed(1);

  return (
    <span className="rating" role="img" aria-label={"Rating " + displayValue + " out of " + max}>
      <Star className="rating__star" size={16} aria-hidden="true" />
      {showValue && (
        <span aria-hidden="true">
          <span className="rating__value">{displayValue}</span>
          <span className="rating__max">/{max}</span>
        </span>
      )}
    </span>
  );
}

export default Rating;
