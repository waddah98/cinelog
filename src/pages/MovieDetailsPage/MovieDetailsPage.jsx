import { Link, useNavigate, useParams } from "react-router";
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

  // Unknown id in the URL: show a "not found" message instead of crashing.
  if (movie === undefined) {
    return (
      <MainLayout watchlistCount={watchlist.length}>
        <EmptyState
          icon="🎬"
          title="Movie not found"
          message={"We could not find a movie with the id \"" + movieId + "\"."}
          actionLabel="Browse all movies"
          onAction={() => navigate("/explore")}
        />
      </MainLayout>
    );
  }

  const status = getStatus(movie.id);

  // Choose the status badge.
  let statusBadge = <Badge>Not in your watchlist</Badge>;
  if (status === "planned") {
    statusBadge = <Badge variant="planned">Planned</Badge>;
  }
  if (status === "watched") {
    statusBadge = <Badge variant="watched">Watched</Badge>;
  }

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <Link to="/explore" className="movie-details__back">
        ← Back to Explore
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
                <Button onClick={() => addToWatchlist(movie.id)}>Add to watchlist</Button>
              )}
              {status !== "watched" && (
                <Button
                  variant={status === "none" ? "secondary" : "primary"}
                  onClick={() => markAsWatched(movie.id)}
                >
                  Mark as watched
                </Button>
              )}
              {status === "watched" && (
                <Button variant="secondary" onClick={() => markAsPlanned(movie.id)}>
                  Move back to planned
                </Button>
              )}
              {status !== "none" && (
                <Button variant="danger" onClick={() => removeFromWatchlist(movie.id)}>
                  Remove from watchlist
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
