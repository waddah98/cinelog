import { fn } from "storybook/test";
import Select from "./Select";

export default {
  title: "Atoms/Select",
  component: Select,
  args: {
    id: "story-select",
    label: "Sort by",
    value: "rating",
    onChange: fn(),
    options: [
      { value: "rating", label: "Rating (highest first)" },
      { value: "year", label: "Release year (newest first)" },
      { value: "title", label: "Title (A–Z)" },
    ],
  },
};

export const Default = {};

export const OtherValueSelected = {
  args: { value: "title" },
};
