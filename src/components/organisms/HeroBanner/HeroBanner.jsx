import Button from "../../atoms/Button/Button";
import Badge from "../../atoms/Badge/Badge";
import GenreTag from "../../molecules/GenreTag/GenreTag";
import MovieMetadata from "../../molecules/MovieMetadata/MovieMetadata";
import "./HeroBanner.css";

// Organism: the big featured movie banner at the top of the Home page.
// - movie: the featured movie object
// - isInWatchlist: true when the movie is already saved
// - onViewDetails(): called by the "View details" button
// - onToggleWatchlist(movieId): adds or removes the movie
function HeroBanner({ movie, isInWatchlist = false, onViewDetails, onToggleWatchlist }) {
  let watchlistLabel = "+ Add to watchlist";
  if (isInWatchlist) {
    watchlistLabel = "✓ In your watchlist";
  }

  return (
    <section className="hero-banner">
      <img className="hero-banner__backdrop" src={movie.backdrop} alt="" />
      <div className="hero-banner__overlay" />

      <div className="hero-banner__content">
        <Badge variant="rating">Featured</Badge>
        <h1 className="hero-banner__title">{movie.title}</h1>
        <MovieMetadata year={movie.year} duration={movie.duration} rating={movie.rating} />
        <div className="hero-banner__genres">
          {movie.genres.map((genre) => (
            <GenreTag key={genre} genre={genre} />
          ))}
        </div>
        <p className="hero-banner__overview">{movie.overview}</p>

        <div className="hero-banner__actions">
          <Button size="large" onClick={onViewDetails}>
            View details
          </Button>
          <Button size="large" variant="secondary" onClick={() => onToggleWatchlist(movie.id)}>
            {watchlistLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
