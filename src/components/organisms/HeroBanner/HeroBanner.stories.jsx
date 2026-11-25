import HeroBanner from "./HeroBanner";
import { movies } from "../../../data/movies";

// Use the movie marked as featured in the mock data.
const featuredMovie = movies.find((movie) => movie.isFeatured);

export default {
  title: "Organisms/HeroBanner",
  component: HeroBanner,
  tags: ["autodocs"],
  args: { movie: featuredMovie, onViewDetails: () => {}, onToggleWatchlist: () => {} },
};

export const FeaturedMovie = {
  args: { isInWatchlist: false },
};

export const AlreadyInWatchlist = {
  args: { isInWatchlist: true },
};
