import { Link } from "react-router";
import Poster from "../../atoms/Poster/Poster";
import Badge from "../../atoms/Badge/Badge";
import Button from "../../atoms/Button/Button";
import IconButton from "../../atoms/IconButton/IconButton";
import GenreTag from "../GenreTag/GenreTag";
import MovieMetadata from "../MovieMetadata/MovieMetadata";
import "./MovieCard.css";

// Molecule: one movie in a grid.
// The card never loads data itself. The parent passes:
// - movie: the movie object from the catalog
// - status: "none" | "planned" | "watched"  (the user's watchlist status)
// - onToggleWatchlist(movieId): optional, shows the bookmark button on the poster
// - onMarkWatched / onMarkPlanned / onRemove (movieId): optional,
//   show extra action buttons (used on the Watchlist page)
function MovieCard({
  movie,
  status = "none",
  onToggleWatchlist,
  onMarkWatched,
  onMarkPlanned,
  onRemove,
}) {
  const detailsLink = "/movies/" + movie.id;
  const isSaved = status !== "none";

  // Only show the first two genres so cards stay the same height.
  const shownGenres = movie.genres.slice(0, 2);

  let bookmarkLabel = "Add to watchlist";
  let bookmarkIcon = "+";
  if (isSaved) {
    bookmarkLabel = "Remove from watchlist";
    bookmarkIcon = "✓";
  }

  const hasActions = onMarkWatched || onMarkPlanned || onRemove;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <Link to={detailsLink}>
          <Poster src={movie.poster} alt={"Poster of " + movie.title} title={movie.title} />
        </Link>

        {status === "planned" && (
          <div className="movie-card__status">
            <Badge variant="planned">Planned</Badge>
          </div>
        )}
        {status === "watched" && (
          <div className="movie-card__status">
            <Badge variant="watched">Watched</Badge>
          </div>
        )}

        {onToggleWatchlist && (
          <div className="movie-card__quick-action">
            <IconButton
              icon={bookmarkIcon}
              label={bookmarkLabel}
              active={isSaved}
              onClick={() => onToggleWatchlist(movie.id)}
            />
          </div>
        )}
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">
          <Link to={detailsLink}>{movie.title}</Link>
        </h3>
        <MovieMetadata year={movie.year} rating={movie.rating} />
        <div className="movie-card__genres">
          {shownGenres.map((genre) => (
            <GenreTag key={genre} genre={genre} />
          ))}
        </div>
      </div>

      {hasActions && (
        <div className="movie-card__actions">
          {status === "planned" && onMarkWatched && (
            <Button size="small" onClick={() => onMarkWatched(movie.id)}>
              Mark watched
            </Button>
          )}
          {status === "watched" && onMarkPlanned && (
            <Button size="small" variant="secondary" onClick={() => onMarkPlanned(movie.id)}>
              Move to planned
            </Button>
          )}
          {onRemove && (
            <Button size="small" variant="danger" onClick={() => onRemove(movie.id)}>
              Remove
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

export default MovieCard;
