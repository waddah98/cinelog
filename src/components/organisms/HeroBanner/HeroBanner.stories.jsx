import { fn } from "storybook/test";
import HeroBanner from "./HeroBanner";
import { movies } from "../../../data/movies";

// Use the movie marked as featured in the mock data.
const featuredMovie = movies.find((movie) => movie.isFeatured);

export default {
  title: "Organisms/HeroBanner",
  component: HeroBanner,
  args: { movie: featuredMovie, onViewDetails: fn(), onToggleWatchlist: fn() },
};

export const FeaturedMovie = {
  args: { isInWatchlist: false },
};

export const AlreadyInWatchlist = {
  args: { isInWatchlist: true },
};
