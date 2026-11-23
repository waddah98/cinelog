import { fn } from "storybook/test";
import { BookmarkPlus } from "lucide-react";
import Button from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
  // `fn()` records clicks in the Storybook "Actions" panel.
  args: { onClick: fn(), children: "Button" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger", "ghost"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
};

export const Primary = {
  args: { variant: "primary", children: "Add to watchlist" },
};

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
  args: { variant: "primary", disabled: true, children: "Not available" },
};

export const WithIcon = {
  args: {
    variant: "primary",
    size: "large",
    children: (
      <>
        <BookmarkPlus size={18} aria-hidden="true" /> Add to watchlist
      </>
    ),
  },
};
