import { fn } from "storybook/test";
import CatalogLayout from "./CatalogLayout";
import FilterPanel from "../../components/organisms/FilterPanel/FilterPanel";
import MovieGrid from "../../components/organisms/MovieGrid/MovieGrid";
import { movies, getAllGenres } from "../../data/movies";

export default {
  title: "Templates/CatalogLayout",
  component: CatalogLayout,
  parameters: { layout: "fullscreen", route: "/explore" },
};

export const WithFiltersAndResults = {
  args: {
    watchlistCount: 2,
    title: "Explore movies",
    description: "Search the full CineTrack catalog, filter by genre and sort the results.",
    filters: (
      <FilterPanel
        search=""
        onSearchChange={fn()}
        genres={getAllGenres()}
        selectedGenre="all"
        onGenreChange={fn()}
        sortBy="rating"
        onSortChange={fn()}
        onClear={fn()}
        resultCount={8}
      />
    ),
    children: <MovieGrid movies={movies.slice(0, 8)} />,
  },
};
