import { fn } from "storybook/test";
import MovieGrid from "./MovieGrid";
import { movies } from "../../../data/movies";

// A pretend watchlist for the stories: first movie planned, second watched.
function getStoryStatus(movieId) {
  if (movieId === movies[0].id) {
    return "planned";
  }
  if (movieId === movies[1].id) {
    return "watched";
  }
  return "none";
}

export default {
  title: "Organisms/MovieGrid",
  component: MovieGrid,
  args: { onToggleWatchlist: fn() },
};

export const WithMovies = {
  args: { movies: movies.slice(0, 10), getStatus: getStoryStatus },
};

export const Empty = {
  args: {
    movies: [],
    emptyTitle: "No movies match your filters",
    emptyMessage: "Try a different title or genre.",
    emptyActionLabel: "Clear filters",
    onEmptyAction: fn(),
  },
};

// The Watchlist page version: cards with action buttons.
export const WatchlistActions = {
  args: {
    movies: movies.slice(0, 2),
    getStatus: getStoryStatus,
    onToggleWatchlist: undefined,
    onMarkWatched: fn(),
    onMarkPlanned: fn(),
    onRemove: fn(),
  },
};
