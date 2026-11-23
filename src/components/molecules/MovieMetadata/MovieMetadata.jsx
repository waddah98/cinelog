import { Calendar, Clock } from "lucide-react";
import Rating from "../../atoms/Rating/Rating";
import "./MovieMetadata.css";

// Turns a number of minutes into text: 148 -> "2h 28m".
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return rest + "m";
  }
  return hours + "h " + rest + "m";
}

// Molecule: a small row with year, runtime and rating.
// Any value that is not passed is simply not shown,
// so the movie card can show only year + rating.
function MovieMetadata({ year, duration, rating }) {
  return (
    <div className="movie-metadata">
      {year && (
        <span className="movie-metadata__item">
          <Calendar size={14} aria-hidden="true" />
          {year}
        </span>
      )}
      {duration && (
        <span className="movie-metadata__item">
          <Clock size={14} aria-hidden="true" />
          {formatDuration(duration)}
        </span>
      )}
      {rating !== undefined && <Rating value={rating} />}
    </div>
  );
}

export default MovieMetadata;
