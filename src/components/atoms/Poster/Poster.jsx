import { useState } from "react";
import "./Poster.css";

// Atom: a movie image with a fallback.
// - aspectRatio: CSS aspect ratio, "2 / 3" for posters or "16 / 9" for backdrops
// - title: shown inside the fallback box when the image is missing
function Poster({ src, alt, title = "", aspectRatio = "2 / 3" }) {
  // Remember whether the image failed to load.
  const [hasError, setHasError] = useState(false);

  // An inline style is the simplest way to use a value that comes from props.
  const style = { aspectRatio: aspectRatio };

  if (!src || hasError) {
    return (
      <div className="poster poster--fallback" style={style}>
        <span className="poster__fallback-icon">🎬</span>
        <span className="poster__fallback-title">{title}</span>
      </div>
    );
  }

  return (
    <img
      className="poster"
      style={style}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}

export default Poster;
