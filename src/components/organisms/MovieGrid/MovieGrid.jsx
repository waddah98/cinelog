import MovieCard from "../../molecules/MovieCard/MovieCard";
import EmptyState from "../../molecules/EmptyState/EmptyState";
import "./MovieGrid.css";

// Organism: a responsive grid of MovieCards, or an EmptyState when there are no movies.
// - movies: array of movie objects to show
// - getStatus(movieId): optional function that returns "none" | "planned" | "watched"
// - onToggleWatchlist, onMarkWatched, onMarkPlanned, onRemove:
//   optional callbacks, passed straight down to every MovieCard
// - emptyTitle, emptyMessage, emptyActionLabel, onEmptyAction: what to show when the list is empty
function MovieGrid({
  movies,
  getStatus,
  onToggleWatchlist,
  onMarkWatched,
  onMarkPlanned,
  onRemove,
  emptyTitle = "No movies found",
  emptyMessage = "",
  emptyActionLabel,
  onEmptyAction,
}) {
  if (movies.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <ul className="movie-grid">
      {movies.map((movie) => {
        let status = "none";
        if (getStatus) {
          status = getStatus(movie.id);
        }

        // The movie id is unique and stable, so it is a good React key.
        return (
          <li key={movie.id}>
            <MovieCard
              movie={movie}
              status={status}
              onToggleWatchlist={onToggleWatchlist}
              onMarkWatched={onMarkWatched}
              onMarkPlanned={onMarkPlanned}
              onRemove={onRemove}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default MovieGrid;
