import StatCard from "./StatCard";

export default {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};

export const Default = {
  args: { label: "Watched", value: 12, description: "Movies you have finished" },
};

export const ZeroValue = {
  args: { label: "Watched", value: 0, description: "Movies you have finished" },
};

export const WithoutDescription = {
  args: { label: "Planned", value: 5 },
};
