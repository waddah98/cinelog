import MovieMetadata from "./MovieMetadata";

export default {
  title: "Molecules/MovieMetadata",
  component: MovieMetadata,
  tags: ["autodocs"],
};

export const Full = {
  args: { year: 2010, duration: 148, rating: 8.8 },
};

// What the MovieCard shows: only year and rating.
export const YearAndRating = {
  args: { year: 2016, rating: 7.9 },
};

export const ShortMovie = {
  args: { year: 2018, duration: 45, rating: 6.5 },
};
