import Input from "./Input";

export default {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  args: { id: "story-input", label: "Movie title", value: "", placeholder: "Type a title..." },
};

export const Empty = {};

export const Filled = {
  args: { value: "Inception" },
};

export const WithoutLabel = {
  args: { label: "", placeholder: "Search by title..." },
};
