import Button from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Add to watchlist",
    variant: "primary",
    size: "medium",
    disabled: false,
  },
};

export const Primary = {};

export const Secondary = {
  args: { variant: "secondary", children: "View details" },
};

export const Danger = {
  args: { variant: "danger", children: "Remove" },
};

export const Ghost = {
  args: { variant: "ghost", children: "Cancel" },
};

export const Disabled = {
  args: { disabled: true, children: "Not available" },
};

export const Large = {
  args: { size: "large", children: "Explore all movies" },
};
