import GenreTag from "./GenreTag";

export default {
  title: "Molecules/GenreTag",
  component: GenreTag,
  tags: ["autodocs"],
  args: { genre: "Sci-Fi" },
};

export const SciFi = {};

export const Drama = {
  args: { genre: "Drama" },
};
