import { useState } from "react";
import "./Avatar.css";

// Turns "Alex Morgan" into "AM". Used when there is no image.
function getInitials(name) {
  const words = name.trim().split(" ");
  let initials = "";

  if (words.length > 0 && words[0] !== "") {
    initials = words[0][0];
  }
  if (words.length > 1) {
    initials = initials + words[words.length - 1][0];
  }

  return initials.toUpperCase();
}

// Atom: a round user picture.
// If `src` is missing, or the image fails to load, the user's initials are shown instead.
// - size: "small" | "medium" | "large"
function Avatar({ src, name = "", size = "medium" }) {
  // Remember whether the image failed to load.
  const [hasError, setHasError] = useState(false);

  const className = "avatar avatar--" + size;
  const showImage = src && !hasError;

  if (showImage) {
    return (
      <img
        className={className}
        src={src}
        alt={name}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span className={className + " avatar--fallback"}>
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
