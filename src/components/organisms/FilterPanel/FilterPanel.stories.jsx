import FilterPanel from "./FilterPanel";
import { getAllGenres } from "../../../data/movies";

export default {
  title: "Organisms/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  args: {
    genres: getAllGenres(),
    onSearchChange: () => {},
    onGenreChange: () => {},
    onSortChange: () => {},
    onClear: () => {},
  },
};

export const Default = {
  args: { search: "", selectedGenre: "all", sortBy: "rating", resultCount: 20 },
};

export const FiltersApplied = {
  args: { search: "the", selectedGenre: "Drama", sortBy: "year", resultCount: 2 },
};

export const NoResults = {
  args: { search: "zzz", selectedGenre: "Horror", sortBy: "title", resultCount: 0 },
};
