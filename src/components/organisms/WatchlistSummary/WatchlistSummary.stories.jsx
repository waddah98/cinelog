import WatchlistSummary from "./WatchlistSummary";

export default {
  title: "Organisms/WatchlistSummary",
  component: WatchlistSummary,
  tags: ["autodocs"],
};

export const WithMovies = {
  args: { total: 7, planned: 4, watched: 3 },
};

export const Empty = {
  args: { total: 0, planned: 0, watched: 0 },
};
