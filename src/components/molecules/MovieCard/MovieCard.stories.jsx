import { fn } from "storybook/test";
import MovieCard from "./MovieCard";
import { movies } from "../../../data/movies";

export default {
  title: "Molecules/MovieCard",
  component: MovieCard,
  args: { movie: movies[0], onToggleWatchlist: fn() },
  argTypes: {
    status: { control: "select", options: ["none", "planned", "watched"] },
  },
  // Show the card at the width it has in the grid.
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
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
    onMarkWatched: fn(),
    onMarkPlanned: fn(),
    onRemove: fn(),
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
