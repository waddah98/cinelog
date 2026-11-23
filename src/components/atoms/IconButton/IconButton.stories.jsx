import { fn } from "storybook/test";
import { BookmarkCheck, BookmarkPlus, Menu } from "lucide-react";
import IconButton from "./IconButton";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  args: { onClick: fn() },
  // The icon is a React element, so it is not editable with a control.
  argTypes: { icon: { control: false } },
};

export const Default = {
  args: { icon: <Menu size={20} />, label: "Open menu" },
};

export const Active = {
  args: { icon: <BookmarkCheck size={18} />, label: "Remove from watchlist", active: true },
};

export const Disabled = {
  args: { icon: <BookmarkPlus size={18} />, label: "Add to watchlist", disabled: true },
};
