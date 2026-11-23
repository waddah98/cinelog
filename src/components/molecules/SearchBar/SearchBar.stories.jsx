import { useState } from "react";
import { fn } from "storybook/test";
import SearchBar from "./SearchBar";

export default {
  title: "Molecules/SearchBar",
  component: SearchBar,
  args: { id: "story-search", onChange: fn() },
};

export const Empty = {
  args: { value: "" },
};

// With text, the clear (X) button appears.
export const WithQuery = {
  args: { value: "dark knight" },
};

// A working example: this story keeps the text in its own state,
// just like the Explore page does through useMovieFilters.
export const Interactive = {
  render: function InteractiveSearchBar() {
    const [text, setText] = useState("");
    return (
      <div>
        <SearchBar id="interactive-search" value={text} onChange={setText} />
        <p style={{ marginTop: 12, color: "#a0a4af" }}>Current value: "{text}"</p>
      </div>
    );
  },
};
