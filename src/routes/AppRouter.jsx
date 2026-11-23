import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import ExplorePage from "../pages/ExplorePage/ExplorePage";
import MovieDetailsPage from "../pages/MovieDetailsPage/MovieDetailsPage";
import WatchlistPage from "../pages/WatchlistPage/WatchlistPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

// All the routes of the app in one place.
// ":movieId" is a URL parameter: /movies/inception gives movieId = "inception".
// "*" matches any URL that no other route matches.
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
