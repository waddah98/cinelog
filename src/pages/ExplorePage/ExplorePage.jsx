import { movies, getAllGenres } from "../../data/movies";
import { useMovieFilters } from "../../hooks/useMovieFilters";
import { useWatchlist } from "../../hooks/useWatchlist";
import CatalogLayout from "../../templates/CatalogLayout/CatalogLayout";
import FilterPanel from "../../components/organisms/FilterPanel/FilterPanel";
import MovieGrid from "../../components/organisms/MovieGrid/MovieGrid";

// The genre list never changes, so we calculate it once when the file loads.
const genres = getAllGenres();

// Page: browse, search, filter and sort the whole catalog.
function ExplorePage() {
  const filters = useMovieFilters(movies);
  const { watchlist, toggleWatchlist, getStatus } = useWatchlist();

  return (
    <CatalogLayout
      watchlistCount={watchlist.length}
      title="Explore movies"
      description="Search the full CineTrack catalog, filter by genre and sort the results."
      filters={
        <FilterPanel
          search={filters.search}
          onSearchChange={filters.setSearch}
          genres={genres}
          selectedGenre={filters.selectedGenre}
          onGenreChange={filters.setSelectedGenre}
          sortBy={filters.sortBy}
          onSortChange={filters.setSortBy}
          onClear={filters.clearFilters}
          resultCount={filters.filteredMovies.length}
        />
      }
    >
      <MovieGrid
        movies={filters.filteredMovies}
        getStatus={getStatus}
        onToggleWatchlist={toggleWatchlist}
        emptyTitle="No movies match your filters"
        emptyMessage="Try a different title or genre, or clear the filters to see every movie."
        emptyActionLabel="Clear filters"
        onEmptyAction={filters.clearFilters}
      />
    </CatalogLayout>
  );
}

export default ExplorePage;
