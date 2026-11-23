import { useState } from "react";
import { Film } from "lucide-react";
import "./Poster.css";

// Atom: a movie image with a fallback.
// - aspectRatio: CSS aspect ratio, "2 / 3" for posters or "16 / 9" for backdrops
// - title: shown inside the fallback box when the image is missing
function Poster({ src, alt, title = "", aspectRatio = "2 / 3" }) {
  // Remember WHICH image failed to load.
  // If the parent later passes a different src, failedSrc no longer matches,
  // so the new image is tried automatically.
  const [failedSrc, setFailedSrc] = useState(null);
  const hasError = failedSrc === src;

  // An inline style is the simplest way to use a value that comes from props.
  const style = { aspectRatio: aspectRatio };

  if (!src || hasError) {
    // An empty alt means the image is decorative, so screen readers should skip the fallback too.
    if (alt === "") {
      return (
        <div className="poster poster--fallback" style={style} aria-hidden="true">
          <Film size={32} />
          <span className="poster__fallback-title">{title}</span>
        </div>
      );
    }

    return (
      <div className="poster poster--fallback" style={style} role="img" aria-label={alt}>
        <Film size={32} aria-hidden="true" />
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
      onError={() => setFailedSrc(src)}
    />
  );
}

export default Poster;
