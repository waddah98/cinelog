import CatalogLayout from "./CatalogLayout";
import FilterPanel from "../../components/organisms/FilterPanel/FilterPanel";
import MovieGrid from "../../components/organisms/MovieGrid/MovieGrid";
import { movies, getAllGenres } from "../../data/movies";

export default {
  title: "Templates/CatalogLayout",
  component: CatalogLayout,
  tags: ["autodocs"],
};

export const WithFiltersAndResults = {
  args: {
    title: "Explore movies",
    description: "Search the full CineTrack catalog, filter by genre and sort the results.",
    filters: (
      <FilterPanel
        search=""
        onSearchChange={() => {}}
        genres={getAllGenres()}
        selectedGenre="all"
        onGenreChange={() => {}}
        sortBy="rating"
        onSortChange={() => {}}
        onClear={() => {}}
        resultCount={8}
      />
    ),
    children: <MovieGrid movies={movies.slice(0, 8)} />,
  },
};
