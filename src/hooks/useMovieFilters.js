import { useMemo, useState } from "react";

// Returns a NEW sorted array. We copy the array first with [...movies]
// because .sort() changes the array it is called on.
function sortMovies(movies, sortBy) {
  const sorted = [...movies];

  if (sortBy === "rating") {
    // Highest rating first.
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year") {
    // Newest release first.
    sorted.sort((a, b) => b.year - a.year);
  } else if (sortBy === "title") {
    // Alphabetical A–Z. localeCompare compares two strings correctly.
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted;
}

// Custom hook: search + genre filter + sort for the Explore page.
// All three settings are applied together, one after the other.
export function useMovieFilters(movies) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // useMemo remembers the result and only recalculates it
  // when the movies, the search, the genre or the sort option change.
  // Other re-renders (for example a watchlist click) reuse the saved result.
  const filteredMovies = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    // 1. Search: keep movies whose title contains the text (case-insensitive).
    let result = movies.filter((movie) => movie.title.toLowerCase().includes(searchText));

    // 2. Genre: keep only movies that have the selected genre.
    if (selectedGenre !== "all") {
      result = result.filter((movie) => movie.genres.includes(selectedGenre));
    }

    // 3. Sort what is left.
    return sortMovies(result, sortBy);
  }, [movies, search, selectedGenre, sortBy]);

  function clearFilters() {
    setSearch("");
    setSelectedGenre("all");
    setSortBy("rating");
  }

  return {
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    filteredMovies,
    clearFilters,
  };
}
