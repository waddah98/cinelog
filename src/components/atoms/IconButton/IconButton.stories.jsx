import IconButton from "./IconButton";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: "☰", label: "Open menu", active: false, disabled: false },
};

export const Default = {};

export const Active = {
  args: { icon: "✓", label: "Remove from watchlist", active: true },
};

export const Disabled = {
  args: { icon: "+", label: "Add to watchlist", disabled: true },
};
