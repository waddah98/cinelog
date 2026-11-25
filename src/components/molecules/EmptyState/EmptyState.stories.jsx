import EmptyState from "./EmptyState";

export default {
  title: "Molecules/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "No movies found",
    message: "Try a different search or genre.",
  },
};

export const WithAction = {
  args: {
    icon: "🔖",
    title: "Your watchlist is empty",
    message: "Save movies from Home or Explore and they will appear here.",
    actionLabel: "Explore movies",
    onAction: () => {},
  },
};
