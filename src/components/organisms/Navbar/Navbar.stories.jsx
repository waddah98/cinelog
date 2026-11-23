import Navbar from "./Navbar";

export default {
  title: "Organisms/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};

// Starting URL "/": the Home link is highlighted.
export const Default = {
  args: { watchlistCount: 0 },
};

// Starting URL "/watchlist": the Watchlist link is highlighted.
export const ActiveNavigation = {
  args: { watchlistCount: 4 },
  parameters: { route: "/watchlist" },
};

// Use the viewport toolbar button (or a narrow window) to see the mobile menu button.
export const Mobile = {
  args: { watchlistCount: 2 },
  globals: { viewport: { value: "mobile1" } },
};
