import { useEffect, useState } from "react";

const STORAGE_KEY = "cinetrack-watchlist";

// Reads the saved watchlist from localStorage.
// If nothing is saved yet (or the saved text is broken), we start with an empty list.
function loadWatchlist() {
  const savedText = localStorage.getItem(STORAGE_KEY);
  if (savedText === null) {
    return [];
  }

  try {
    return JSON.parse(savedText);
  } catch (error) {
    console.log("Could not read the saved watchlist:", error);
    return [];
  }
}

// Custom hook: the watchlist and all its actions in one place.
// Each entry only stores the movie id and the user's tracking information:
// { movieId, status: "planned" | "watched", addedAt, watchedAt }
// The movie details (title, poster...) always come from the catalog.
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(loadWatchlist());

  // Every time the watchlist changes, save it in localStorage
  // so it is still there after a page refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  function isInWatchlist(movieId) {
    const entry = watchlist.find((item) => item.movieId === movieId);
    return entry !== undefined;
  }

  // Returns "none", "planned" or "watched".
  function getStatus(movieId) {
    const entry = watchlist.find((item) => item.movieId === movieId);
    if (entry === undefined) {
      return "none";
    }
    return entry.status;
  }

  function addToWatchlist(movieId) {
    // Do nothing if the movie is already saved (no duplicates).
    if (isInWatchlist(movieId)) {
      return;
    }

    const newEntry = {
      movieId: movieId,
      status: "planned",
      addedAt: new Date().toISOString(),
      watchedAt: null,
    };
    // Create a NEW array (never change the state directly).
    setWatchlist([...watchlist, newEntry]);
  }

  function removeFromWatchlist(movieId) {
    const newList = watchlist.filter((item) => item.movieId !== movieId);
    setWatchlist(newList);
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
      setWatchlist([...watchlist, newEntry]);
      return;
    }

    const newList = watchlist.map((item) => {
      if (item.movieId === movieId) {
        return { ...item, status: "watched", watchedAt: now };
      }
      return item;
    });
    setWatchlist(newList);
  }

  function markAsPlanned(movieId) {
    const newList = watchlist.map((item) => {
      if (item.movieId === movieId) {
        return { ...item, status: "planned", watchedAt: null };
      }
      return item;
    });
    setWatchlist(newList);
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
    isInWatchlist,
    getStatus,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    markAsPlanned,
    toggleWatchlist,
  };
}
