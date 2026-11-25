import "./Rating.css";

// Atom: shows a movie rating with a star, for example "★ 8.8/10".
// - value: the rating number (out of 10)
function Rating({ value }) {
  // toFixed(1) always shows one decimal: 9 becomes "9.0".
  const displayValue = Number(value).toFixed(1);

  return (
    <span className="rating">
      <span className="rating__star">★</span>
      <span className="rating__value">{displayValue}</span>
      <span className="rating__max">/10</span>
    </span>
  );
}

export default Rating;
