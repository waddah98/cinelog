import SearchBar from "./SearchBar";

export default {
  title: "Molecules/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  args: { id: "story-search", value: "", onChange: () => {} },
};

export const Empty = {};

// With text, the clear (✕) button appears.
export const WithQuery = {
  args: { value: "dark knight" },
};
