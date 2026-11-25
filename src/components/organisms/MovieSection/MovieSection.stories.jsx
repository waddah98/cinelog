import MovieSection from "./MovieSection";
import { movies } from "../../../data/movies";

export default {
  title: "Organisms/MovieSection",
  component: MovieSection,
  tags: ["autodocs"],
  args: { onToggleWatchlist: () => {}, getStatus: () => "none" },
};

export const Trending = {
  args: {
    title: "Trending now",
    description: "What everyone is talking about this week.",
    actionLabel: "See all",
    actionTo: "/explore",
    movies: movies.filter((movie) => movie.isTrending).slice(0, 5),
  },
};

export const EmptySection = {
  args: {
    title: "Recently watched",
    movies: [],
    emptyTitle: "Nothing watched yet",
    emptyMessage: "Movies you mark as watched will show up here.",
  },
};
