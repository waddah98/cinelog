import Select from "./Select";

export default {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    id: "story-select",
    label: "Sort by",
    value: "rating",
    onChange: () => {},
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
