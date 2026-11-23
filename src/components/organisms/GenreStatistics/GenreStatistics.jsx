import { PieChart } from "lucide-react";
import EmptyState from "../../molecules/EmptyState/EmptyState";
import GenreTag from "../../molecules/GenreTag/GenreTag";
import "./GenreStatistics.css";

// Organism: a small bar chart of the genres the user has watched.
// - genreCounts: array like [{ genre: "Sci-Fi", count: 3 }, ...], sorted from most to least
function GenreStatistics({ genreCounts }) {
  if (genreCounts.length === 0) {
    return (
      <EmptyState
        icon={<PieChart size={40} />}
        title="No genre statistics yet"
        message="Mark a movie as watched and your favorite genres will appear here."
      />
    );
  }

  // The first genre has the highest count; its bar is 100% wide.
  const highestCount = genreCounts[0].count;

  return (
    <ul className="genre-statistics">
      {genreCounts.map((item) => {
        const percent = (item.count / highestCount) * 100;
        let movieWord = "movies";
        if (item.count === 1) {
          movieWord = "movie";
        }

        return (
          <li key={item.genre} className="genre-statistics__row">
            <div className="genre-statistics__label">
              <GenreTag genre={item.genre} />
              <span className="genre-statistics__count">
                {item.count} {movieWord}
              </span>
            </div>
            <div className="genre-statistics__track" aria-hidden="true">
              <div className="genre-statistics__bar" style={{ width: percent + "%" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GenreStatistics;
