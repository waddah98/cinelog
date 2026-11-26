import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { movies, getAllGenres } from "../../data/movies";
import { TOGGLE_WATCHLIST, getStatus } from "../../features/watchlistSlice";
import CatalogLayout from "../../templates/CatalogLayout/CatalogLayout";
import FilterPanel from "../../components/organisms/FilterPanel/FilterPanel";
import MovieGrid from "../../components/organisms/MovieGrid/MovieGrid";

// The genre list never changes, so we calculate it once when the file loads.
const genres = getAllGenres();

// Returns a NEW sorted array. We copy the array first with [...list]
// because .sort() changes the array it is called on.
function sortMovies(list, sortBy) {
  const sorted = [...list];

  if (sortBy === "rating") {
    // Highest rating first.
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year") {
    // Newest release first.
    sorted.sort((a, b) => b.year - a.year);
  } else if (sortBy === "title") {
    // Alphabetical A–Z.
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted;
}

// Page: browse, search, filter and sort the whole catalog.
// The page owns the filter state and passes it down to FilterPanel.
function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const watchlist = useSelector((state) => state.watchlist.items);
  const dispatch = useDispatch();

  // 1. Search: keep movies whose title contains the text (upper/lower case ignored).
  const searchText = search.trim().toLowerCase();
  let filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchText));

  // 2. Genre: keep only movies that have the selected genre.
  if (selectedGenre !== "all") {
    filteredMovies = filteredMovies.filter((movie) => movie.genres.includes(selectedGenre));
  }

  // 3. Sort what is left.
  filteredMovies = sortMovies(filteredMovies, sortBy);

  function getMovieStatus(movieId) {
    return getStatus(watchlist, movieId);
  }

  function handleToggleWatchlist(movieId) {
    dispatch(TOGGLE_WATCHLIST({ movieId: movieId, date: new Date().toISOString() }));
  }

  function clearFilters() {
    setSearch("");
    setSelectedGenre("all");
    setSortBy("rating");
  }

  return (
    <CatalogLayout
      title="Explore movies"
      description="Search the full CineTrack catalog, filter by genre and sort the results."
      filters={
        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClear={clearFilters}
          resultCount={filteredMovies.length}
        />
      }
    >
      <MovieGrid
        movies={filteredMovies}
        getStatus={getMovieStatus}
        onToggleWatchlist={handleToggleWatchlist}
        emptyTitle="No movies match your filters"
        emptyMessage="Try a different title or genre, or clear the filters to see every movie."
        emptyActionLabel="Clear filters"
        onEmptyAction={clearFilters}
      />
    </CatalogLayout>
  );
}

export default ExplorePage;
