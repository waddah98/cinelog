import Badge from "./Badge";

export default {
  title: "Atoms/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "select", options: ["default", "genre", "planned", "watched", "rating"] },
  },
};

export const Default = {
  args: { variant: "default", children: "Not in your watchlist" },
};

export const Genre = {
  args: { variant: "genre", children: "Sci-Fi" },
};

export const Status = {
  args: { variant: "watched", children: "Watched" },
};

export const PlannedStatus = {
  args: { variant: "planned", children: "Planned" },
};

export const Rating = {
  args: { variant: "rating", children: "Featured" },
};
