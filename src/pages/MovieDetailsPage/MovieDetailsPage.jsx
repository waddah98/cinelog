import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookmarkPlus, Check, Eye, Film, RotateCcw, Trash2 } from "lucide-react";
import { getMovieById } from "../../data/movies";
import { useWatchlist } from "../../hooks/useWatchlist";
import MainLayout from "../../templates/MainLayout/MainLayout";
import Poster from "../../components/atoms/Poster/Poster";
import Badge from "../../components/atoms/Badge/Badge";
import Button from "../../components/atoms/Button/Button";
import GenreTag from "../../components/molecules/GenreTag/GenreTag";
import MovieMetadata from "../../components/molecules/MovieMetadata/MovieMetadata";
import EmptyState from "../../components/molecules/EmptyState/EmptyState";
import "./MovieDetailsPage.css";

// Page: all the information about one movie, plus watchlist actions.
// The movie id comes from the URL: /movies/:movieId
function MovieDetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { watchlist, getStatus, addToWatchlist, removeFromWatchlist, markAsWatched, markAsPlanned } =
    useWatchlist();

  const movie = getMovieById(movieId);

  // Unknown id in the URL: show a safe "not found" message instead of crashing.
  if (movie === undefined) {
    return (
      <MainLayout watchlistCount={watchlist.length}>
        <EmptyState
          icon={<Film size={40} />}
          title="Movie not found"
          message={"We could not find a movie with the id \"" + movieId + "\"."}
          actionLabel="Browse all movies"
          onAction={() => navigate("/explore")}
        />
      </MainLayout>
    );
  }

  const status = getStatus(movie.id);

  // Choose the status badge (text + icon, so it does not rely on color only).
  let statusBadge = <Badge>Not in your watchlist</Badge>;
  if (status === "planned") {
    statusBadge = (
      <Badge variant="planned">
        <Eye size={12} aria-hidden="true" /> Planned
      </Badge>
    );
  }
  if (status === "watched") {
    statusBadge = (
      <Badge variant="watched">
        <Check size={12} aria-hidden="true" /> Watched
      </Badge>
    );
  }

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <Link to="/explore" className="movie-details__back">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Explore
      </Link>

      <article className="movie-details">
        <div className="movie-details__backdrop">
          <Poster src={movie.backdrop} alt="" title={movie.title} aspectRatio="16 / 9" />
        </div>

        <div className="movie-details__main">
          <div className="movie-details__poster">
            <Poster src={movie.poster} alt={"Poster of " + movie.title} title={movie.title} />
          </div>

          <div className="movie-details__info">
            <h1>{movie.title}</h1>
            <MovieMetadata year={movie.year} duration={movie.duration} rating={movie.rating} />

            <div className="movie-details__genres">
              {movie.genres.map((genre) => (
                <GenreTag key={genre} genre={genre} />
              ))}
            </div>

            <div className="movie-details__status">
              <span className="movie-details__label">Your status:</span> {statusBadge}
            </div>

            {/* Which buttons are shown depends on the current status. */}
            <div className="movie-details__actions">
              {status === "none" && (
                <Button onClick={() => addToWatchlist(movie.id)}>
                  <BookmarkPlus size={18} aria-hidden="true" /> Add to watchlist
                </Button>
              )}
              {status !== "watched" && (
                <Button
                  variant={status === "none" ? "secondary" : "primary"}
                  onClick={() => markAsWatched(movie.id)}
                >
                  <Check size={18} aria-hidden="true" /> Mark as watched
                </Button>
              )}
              {status === "watched" && (
                <Button variant="secondary" onClick={() => markAsPlanned(movie.id)}>
                  <RotateCcw size={18} aria-hidden="true" /> Move back to planned
                </Button>
              )}
              {status !== "none" && (
                <Button variant="danger" onClick={() => removeFromWatchlist(movie.id)}>
                  <Trash2 size={18} aria-hidden="true" /> Remove from watchlist
                </Button>
              )}
            </div>

            <section className="movie-details__section">
              <h2>Overview</h2>
              <p>{movie.overview}</p>
            </section>

            <section className="movie-details__section">
              <h2>Director</h2>
              <p>{movie.director}</p>
            </section>

            <section className="movie-details__section">
              <h2>Cast</h2>
              <ul className="movie-details__cast">
                {movie.cast.map((actor) => (
                  <li key={actor}>{actor}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}

export default MovieDetailsPage;
