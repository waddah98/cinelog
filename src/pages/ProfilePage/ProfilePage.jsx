import { getMovieById } from "../../data/movies";
import { mockUser } from "../../data/user";
import { useWatchlist } from "../../hooks/useWatchlist";
import MainLayout from "../../templates/MainLayout/MainLayout";
import ProfileSummary from "../../components/organisms/ProfileSummary/ProfileSummary";
import WatchlistSummary from "../../components/organisms/WatchlistSummary/WatchlistSummary";
import GenreStatistics from "../../components/organisms/GenreStatistics/GenreStatistics";
import MovieSection from "../../components/organisms/MovieSection/MovieSection";
import "./ProfilePage.css";

// Counts how many watched movies belong to each genre.
// Returns an array sorted from the most to the least watched genre:
// [{ genre: "Sci-Fi", count: 3 }, { genre: "Drama", count: 2 }, ...]
function countGenres(watchedMovies) {
  // Step 1: use an object as a counter, for example { "Sci-Fi": 3, "Drama": 2 }
  const counts = {};
  watchedMovies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      if (counts[genre]) {
        counts[genre] = counts[genre] + 1;
      } else {
        counts[genre] = 1;
      }
    });
  });

  // Step 2: turn the object into an array so we can sort it and use .map in JSX.
  const result = Object.keys(counts).map((genre) => {
    return { genre: genre, count: counts[genre] };
  });

  // Step 3: highest count first. If two genres have the same count, sort A–Z.
  result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.genre.localeCompare(b.genre);
  });

  return result;
}

// Page: the mock user's profile and statistics.
// Nothing here is saved separately: every number is calculated
// from the current watchlist each time the page renders.
function ProfilePage() {
  const { watchlist, getStatus, toggleWatchlist } = useWatchlist();

  const watchedEntries = watchlist.filter((entry) => entry.status === "watched");
  const plannedCount = watchlist.length - watchedEntries.length;

  // Most recently watched first.
  const sortedWatched = [...watchedEntries];
  sortedWatched.sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));

  const watchedMovies = sortedWatched.map((entry) => getMovieById(entry.movieId));
  const genreCounts = countGenres(watchedMovies);

  let favoriteGenre = "";
  if (genreCounts.length > 0) {
    favoriteGenre = genreCounts[0].genre;
  }

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <ProfileSummary user={mockUser} favoriteGenre={favoriteGenre} />

      <section className="profile-page__section" aria-labelledby="activity-heading">
        <h2 id="activity-heading">Your activity</h2>
        <WatchlistSummary
          total={watchlist.length}
          planned={plannedCount}
          watched={watchedEntries.length}
        />
      </section>

      <section className="profile-page__section" aria-labelledby="genres-heading">
        <h2 id="genres-heading">Favorite genres</h2>
        <GenreStatistics genreCounts={genreCounts} />
      </section>

      <MovieSection
        id="recently-watched"
        title="Recently watched"
        description="The last movies you marked as watched."
        movies={watchedMovies.slice(0, 5)}
        getStatus={getStatus}
        onToggleWatchlist={toggleWatchlist}
        emptyTitle="Nothing watched yet"
        emptyMessage="Movies you mark as watched will show up here."
      />
    </MainLayout>
  );
}

export default ProfilePage;
