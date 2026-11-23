import GenreTag from "./GenreTag";
import { getAllGenres } from "../../../data/movies";

export default {
  title: "Molecules/GenreTag",
  component: GenreTag,
};

export const Default = {
  args: { genre: "Sci-Fi" },
};

// Every genre used in the mock catalog.
export const AllGenres = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {getAllGenres().map((genre) => (
        <GenreTag key={genre} genre={genre} />
      ))}
    </div>
  ),
};
