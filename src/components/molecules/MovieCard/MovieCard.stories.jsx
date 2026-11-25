import MovieCard from "./MovieCard";
import { movies } from "../../../data/movies";

export default {
  title: "Molecules/MovieCard",
  component: MovieCard,
  tags: ["autodocs"],
  args: { movie: movies[0], onToggleWatchlist: () => {} },
};

export const Default = {
  args: { status: "none" },
};

export const InWatchlist = {
  args: { status: "planned" },
};

export const Watched = {
  args: { status: "watched" },
};

// On the Watchlist page the card gets extra action buttons.
export const WithWatchlistActions = {
  args: {
    movie: movies[1],
    status: "planned",
    onToggleWatchlist: undefined,
    onMarkWatched: () => {},
    onMarkPlanned: () => {},
    onRemove: () => {},
  },
};

export const MissingPoster = {
  args: {
    movie: { ...movies[2], poster: "/images/movies/missing.jpg" },
    status: "none",
  },
};

export const LongTitle = {
  args: { movie: movies[18], status: "none" },
};
