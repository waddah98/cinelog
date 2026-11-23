import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./MovieSection.css";

// Organism: a titled section with an optional "See all" link and a MovieGrid.
// Used for "Trending", "Top rated", "Recently added" on Home
// and "Recently watched" on Profile.
// - id: used to connect the heading to the section for screen readers
// - actionLabel + actionTo: optional link in the section header
// - the rest of the props are passed to MovieGrid
function MovieSection({
  id,
  title,
  description,
  actionLabel,
  actionTo,
  movies,
  getStatus,
  onToggleWatchlist,
  emptyTitle,
  emptyMessage,
}) {
  const headingId = id + "-heading";

  return (
    <section className="movie-section" aria-labelledby={headingId}>
      <div className="movie-section__header">
        <div>
          <h2 id={headingId}>{title}</h2>
          {description && <p className="movie-section__description">{description}</p>}
        </div>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="movie-section__link">
            {actionLabel}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>

      <MovieGrid
        movies={movies}
        getStatus={getStatus}
        onToggleWatchlist={onToggleWatchlist}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
      />
    </section>
  );
}

export default MovieSection;
