import { createSlice } from "@reduxjs/toolkit";

// The watchlist part of the Redux store.
// Each entry only stores the movie id and the user's tracking information:
// { movieId, status: "planned" | "watched", addedAt, watchedAt }
// The movie details (title, poster...) always come from the catalog (data/movies.js).
const initialState = { items: [] };

const watchlistSlice = createSlice({
  name: "WATCHLIST",
  initialState,
  reducers: {
    // payload: { movieId, date }
    ADD_TO_WATCHLIST(state, action) {
      const entry = state.items.find((item) => item.movieId === action.payload.movieId);
      // Do nothing if the movie is already saved (no duplicates).
      if (entry !== undefined) {
        return;
      }
      state.items.push({
        movieId: action.payload.movieId,
        status: "planned",
        addedAt: action.payload.date,
        watchedAt: null,
      });
    },

    // payload: movieId
    REMOVE_FROM_WATCHLIST(state, action) {
      state.items = state.items.filter((item) => item.movieId !== action.payload);
    },

    // payload: { movieId, date }
    MARK_AS_WATCHED(state, action) {
      const entry = state.items.find((item) => item.movieId === action.payload.movieId);
      // If the movie is not saved yet, add it directly as "watched".
      if (entry === undefined) {
        state.items.push({
          movieId: action.payload.movieId,
          status: "watched",
          addedAt: action.payload.date,
          watchedAt: action.payload.date,
        });
        return;
      }
      entry.status = "watched";
      entry.watchedAt = action.payload.date;
    },

    // payload: movieId
    MARK_AS_PLANNED(state, action) {
      const entry = state.items.find((item) => item.movieId === action.payload);
      if (entry !== undefined) {
        entry.status = "planned";
        entry.watchedAt = null;
      }
    },

    // Used by the bookmark buttons: add if missing, remove if already saved.
    // payload: { movieId, date }
    TOGGLE_WATCHLIST(state, action) {
      const entry = state.items.find((item) => item.movieId === action.payload.movieId);
      if (entry === undefined) {
        state.items.push({
          movieId: action.payload.movieId,
          status: "planned",
          addedAt: action.payload.date,
          watchedAt: null,
        });
      } else {
        state.items = state.items.filter((item) => item.movieId !== action.payload.movieId);
      }
    },
  },
});

export const {
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST,
  MARK_AS_WATCHED,
  MARK_AS_PLANNED,
  TOGGLE_WATCHLIST,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;

// Small helper (not a reducer): returns "none", "planned" or "watched" for one movie.
export function getStatus(items, movieId) {
  const entry = items.find((item) => item.movieId === movieId);
  if (entry === undefined) {
    return "none";
  }
  return entry.status;
}
