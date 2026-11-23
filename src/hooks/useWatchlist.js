import { useLocalStorage } from "./useLocalStorage";
import { getMovieById } from "../data/movies";

const STORAGE_KEY = "cinetrack-watchlist";

// Checks that a saved entry looks correct and points to a movie that exists.
// Broken entries (for example edited by hand in the browser) are ignored.
function isValidEntry(entry) {
  if (!entry || typeof entry.movieId !== "string" || typeof entry.addedAt !== "string") {
    return false;
  }
  if (entry.status !== "planned" && entry.status !== "watched") {
    return false;
  }
  if (entry.status === "watched" && typeof entry.watchedAt !== "string") {
    return false;
  }
  if (getMovieById(entry.movieId) === undefined) {
    return false;
  }
  return true;
}

// Custom hook: all watchlist actions in one place.
// Each entry only stores the movie id and the user's tracking information:
// { movieId, status: "planned" | "watched", addedAt, watchedAt }
// The movie details (title, poster...) always come from the catalog.
export function useWatchlist() {
  const [savedList, setSavedList] = useLocalStorage(STORAGE_KEY, []);

  // Be safe: if the saved data is not an array, start with an empty list.
  let watchlist = [];
  if (Array.isArray(savedList)) {
    watchlist = savedList.filter(isValidEntry);
  }

  function getEntry(movieId) {
    return watchlist.find((entry) => entry.movieId === movieId);
  }

  function isInWatchlist(movieId) {
    return getEntry(movieId) !== undefined;
  }

  // Returns "none", "planned" or "watched".
  function getStatus(movieId) {
    const entry = getEntry(movieId);
    if (entry === undefined) {
      return "none";
    }
    return entry.status;
  }

  function addToWatchlist(movieId) {
    // Prevent duplicates: do nothing if the movie is already saved.
    if (isInWatchlist(movieId)) {
      return;
    }

    const newEntry = {
      movieId: movieId,
      status: "planned",
      addedAt: new Date().toISOString(),
      watchedAt: null,
    };
    // Create a NEW array (never change state directly) so React sees the update.
    setSavedList([...watchlist, newEntry]);
  }

  function removeFromWatchlist(movieId) {
    const newList = watchlist.filter((entry) => entry.movieId !== movieId);
    setSavedList(newList);
  }

  function markAsWatched(movieId) {
    const now = new Date().toISOString();

    // If the movie is not saved yet, add it directly as "watched".
    if (!isInWatchlist(movieId)) {
      const newEntry = {
        movieId: movieId,
        status: "watched",
        addedAt: now,
        watchedAt: now,
      };
      setSavedList([...watchlist, newEntry]);
      return;
    }

    const newList = watchlist.map((entry) => {
      if (entry.movieId === movieId) {
        return { ...entry, status: "watched", watchedAt: now };
      }
      return entry;
    });
    setSavedList(newList);
  }

  function markAsPlanned(movieId) {
    const newList = watchlist.map((entry) => {
      if (entry.movieId === movieId) {
        return { ...entry, status: "planned", watchedAt: null };
      }
      return entry;
    });
    setSavedList(newList);
  }

  // Used by the bookmark buttons: add if missing, remove if already saved.
  function toggleWatchlist(movieId) {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    markAsPlanned,
    toggleWatchlist,
    isInWatchlist,
    getEntry,
    getStatus,
  };
}
