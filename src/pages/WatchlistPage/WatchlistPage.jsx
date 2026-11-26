import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getMovieById } from "../../data/movies";
import {
  REMOVE_FROM_WATCHLIST,
  MARK_AS_WATCHED,
  MARK_AS_PLANNED,
  getStatus,
} from "../../features/watchlistSlice";
import MainLayout from "../../templates/MainLayout/MainLayout";
import Button from "../../components/atoms/Button/Button";
import EmptyState from "../../components/molecules/EmptyState/EmptyState";
import MovieGrid from "../../components/organisms/MovieGrid/MovieGrid";
import WatchlistSummary from "../../components/organisms/WatchlistSummary/WatchlistSummary";
import "./WatchlistPage.css";

// The three status filter buttons.
const statusFilters = [
  { value: "all", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "watched", label: "Watched" },
];

// Page: the user's saved movies, with status filter and actions.
function WatchlistPage() {
  const navigate = useNavigate();
  const watchlist = useSelector((state) => state.watchlist.items);
  const dispatch = useDispatch();

  // Local page state: which status filter is selected.
  const [statusFilter, setStatusFilter] = useState("all");

  const plannedCount = watchlist.filter((entry) => entry.status === "planned").length;
  const watchedCount = watchlist.filter((entry) => entry.status === "watched").length;

  // 1. Keep only the entries that match the selected status filter.
  let visibleEntries = watchlist;
  if (statusFilter !== "all") {
    visibleEntries = watchlist.filter((entry) => entry.status === statusFilter);
  }

  // 2. Show the most recently added movies first.
  //    We copy the array before sorting so we don't change the hook's data.
  const sortedEntries = [...visibleEntries];
  sortedEntries.sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  // 3. Turn each entry into the full movie object from the catalog.
  const visibleMovies = sortedEntries.map((entry) => getMovieById(entry.movieId));

  function getMovieStatus(movieId) {
    return getStatus(watchlist, movieId);
  }

  function handleMarkWatched(movieId) {
    dispatch(MARK_AS_WATCHED({ movieId: movieId, date: new Date().toISOString() }));
  }

  function handleMarkPlanned(movieId) {
    dispatch(MARK_AS_PLANNED(movieId));
  }

  function handleRemove(movieId) {
    dispatch(REMOVE_FROM_WATCHLIST(movieId));
  }

  let emptyTitle = "No planned movies";
  let emptyMessage = "Every movie in your watchlist has been watched. Nice work!";
  if (statusFilter === "watched") {
    emptyTitle = "No watched movies yet";
    emptyMessage = "Mark a planned movie as watched and it will appear here.";
  }

  return (
    <MainLayout>
      <header className="page-header">
        <h1>My Watchlist</h1>
        <p>Keep track of the movies you want to see and the ones you have already watched.</p>
      </header>

      <WatchlistSummary total={watchlist.length} planned={plannedCount} watched={watchedCount} />

      {watchlist.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="Your watchlist is empty"
          message="Save movies from Home or Explore and they will appear here."
          actionLabel="Explore movies"
          onAction={() => navigate("/explore")}
        />
      ) : (
        <section className="watchlist-page__list">
          <div className="watchlist-page__filters">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                size="small"
                variant={statusFilter === filter.value ? "primary" : "secondary"}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <MovieGrid
            movies={visibleMovies}
            getStatus={getMovieStatus}
            onMarkWatched={handleMarkWatched}
            onMarkPlanned={handleMarkPlanned}
            onRemove={handleRemove}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            emptyActionLabel="Show all"
            onEmptyAction={() => setStatusFilter("all")}
          />
        </section>
      )}
    </MainLayout>
  );
}

export default WatchlistPage;
