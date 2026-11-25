import Navbar from "./Navbar";

export default {
  title: "Organisms/Navbar",
  component: Navbar,
  tags: ["autodocs"],
};

export const EmptyWatchlist = {
  args: { watchlistCount: 0 },
};

export const WithSavedMovies = {
  args: { watchlistCount: 4 },
};
