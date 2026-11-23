import GenreStatistics from "./GenreStatistics";

export default {
  title: "Organisms/GenreStatistics",
  component: GenreStatistics,
};

export const WithData = {
  args: {
    genreCounts: [
      { genre: "Sci-Fi", count: 4 },
      { genre: "Drama", count: 3 },
      { genre: "Thriller", count: 2 },
      { genre: "Comedy", count: 1 },
    ],
  },
};

export const Empty = {
  args: { genreCounts: [] },
};
