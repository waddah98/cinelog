import Poster from "./Poster";
import { movies } from "../../../data/movies";

const movie = movies[0];

export default {
  title: "Atoms/Poster",
  component: Poster,
  tags: ["autodocs"],
};

export const WithImage = {
  args: { src: movie.poster, alt: "Poster of " + movie.title, title: movie.title },
};

export const MissingImage = {
  args: { src: "/images/movies/missing.jpg", alt: "Poster of Unknown Movie", title: "Unknown Movie" },
};

export const NoSource = {
  args: { src: "", alt: "Poster of Untitled", title: "Untitled" },
};

export const Backdrop = {
  args: { src: movie.backdrop, alt: "", title: movie.title, aspectRatio: "16 / 9" },
};
