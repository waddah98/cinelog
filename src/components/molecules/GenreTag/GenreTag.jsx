import Badge from "../../atoms/Badge/Badge";

// Molecule: a Badge that is always configured for a movie genre.
// Using GenreTag everywhere means all genres look the same across the app.
function GenreTag({ genre }) {
  return <Badge variant="genre">{genre}</Badge>;
}

export default GenreTag;
