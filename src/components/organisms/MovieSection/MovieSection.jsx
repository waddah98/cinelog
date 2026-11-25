import { Link } from "react-router";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./MovieSection.css";

// Organism: a titled section with an optional "See all" link and a MovieGrid.
// Used for "Trending", "Top rated", "Recently added" on Home
// and "Recently watched" on Profile.
// - actionLabel + actionTo: optional link in the section header
// - the rest of the props are passed to MovieGrid
function MovieSection({
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
  return (
    <section className="movie-section">
      <div className="movie-section__header">
        <div>
          <h2>{title}</h2>
          {description && <p className="movie-section__description">{description}</p>}
        </div>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="movie-section__link">
            {actionLabel} →
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
