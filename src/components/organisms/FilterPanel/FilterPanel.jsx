import SearchBar from "../../molecules/SearchBar/SearchBar";
import Select from "../../atoms/Select/Select";
import Button from "../../atoms/Button/Button";
import "./FilterPanel.css";

// The sort options offered on the Explore page.
// The values must match the ones handled in ExplorePage (sortMovies).
const sortOptions = [
  { value: "rating", label: "Rating (highest first)" },
  { value: "year", label: "Release year (newest first)" },
  { value: "title", label: "Title (A–Z)" },
];

// Organism: search + genre filter + sort + "clear filters".
// It only displays the controls. The values and the filtering logic
// live in the Explore page, which passes them in through props.
function FilterPanel({
  search,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  onClear,
  resultCount,
}) {
  // Build the genre options, with "All genres" first.
  const genreOptions = [{ value: "all", label: "All genres" }];
  genres.forEach((genre) => {
    genreOptions.push({ value: genre, label: genre });
  });

  return (
    <div className="filter-panel">
      <div className="filter-panel__search">
        <SearchBar id="explore-search" value={search} onChange={onSearchChange} />
      </div>

      <div className="filter-panel__controls">
        <Select
          id="genre-filter"
          label="Genre"
          value={selectedGenre}
          options={genreOptions}
          onChange={(event) => onGenreChange(event.target.value)}
        />
        <Select
          id="sort-by"
          label="Sort by"
          value={sortBy}
          options={sortOptions}
          onChange={(event) => onSortChange(event.target.value)}
        />
        <div className="filter-panel__clear">
          <Button variant="secondary" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>

      <p className="filter-panel__count">
        {resultCount === 1 ? "1 movie found" : resultCount + " movies found"}
      </p>
    </div>
  );
}

export default FilterPanel;
