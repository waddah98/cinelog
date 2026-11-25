import { useNavigate } from "react-router";
import { movies } from "../../data/movies";
import { useWatchlist } from "../../hooks/useWatchlist";
import MainLayout from "../../templates/MainLayout/MainLayout";
import Button from "../../components/atoms/Button/Button";
import HeroBanner from "../../components/organisms/HeroBanner/HeroBanner";
import MovieSection from "../../components/organisms/MovieSection/MovieSection";
import "./HomePage.css";

// How many movies each Home section shows.
const SECTION_SIZE = 5;

// The lists below are built from the shared catalog, not copied by hand.
// They do not change, so they are calculated once when the file loads.

// First movie marked as featured (or the first movie, just in case none is featured).
let featuredMovie = movies.find((movie) => movie.isFeatured);
if (featuredMovie === undefined) {
  featuredMovie = movies[0];
}

const trendingMovies = movies.filter((movie) => movie.isTrending).slice(0, SECTION_SIZE);

// Copy, sort by rating (highest first), keep the first few.
const topRatedMovies = [...movies];
topRatedMovies.sort((a, b) => b.rating - a.rating);

// Copy, sort by date added (newest first). ISO dates can be compared as text.
const recentMovies = [...movies];
recentMovies.sort((a, b) => b.addedAt.localeCompare(a.addedAt));

// Page: the starting point for discovering movies.
function HomePage() {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, getStatus, isInWatchlist } = useWatchlist();

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <HeroBanner
        movie={featuredMovie}
        isInWatchlist={isInWatchlist(featuredMovie.id)}
        onViewDetails={() => navigate("/movies/" + featuredMovie.id)}
        onToggleWatchlist={toggleWatchlist}
      />

      <MovieSection
        title="Trending now"
        description="What everyone is talking about this week."
        actionLabel="See all"
        actionTo="/explore"
        movies={trendingMovies}
        getStatus={getStatus}
        onToggleWatchlist={toggleWatchlist}
      />

      <MovieSection
        title="Top rated"
        description="The highest rated movies in the catalog."
        actionLabel="See all"
        actionTo="/explore"
        movies={topRatedMovies.slice(0, SECTION_SIZE)}
        getStatus={getStatus}
        onToggleWatchlist={toggleWatchlist}
      />

      <MovieSection
        title="Recently added"
        description="Fresh additions to CineTrack."
        actionLabel="See all"
        actionTo="/explore"
        movies={recentMovies.slice(0, SECTION_SIZE)}
        getStatus={getStatus}
        onToggleWatchlist={toggleWatchlist}
      />

      <section className="home-page__explore">
        <h2>Looking for something else?</h2>
        <p>Search the full catalog, filter by genre and sort by rating, year or title.</p>
        <Button size="large" onClick={() => navigate("/explore")}>
          Explore all movies
        </Button>
      </section>
    </MainLayout>
  );
}

export default HomePage;
