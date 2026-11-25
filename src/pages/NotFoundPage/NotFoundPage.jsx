import { useNavigate } from "react-router";
import { useWatchlist } from "../../hooks/useWatchlist";
import MainLayout from "../../templates/MainLayout/MainLayout";
import EmptyState from "../../components/molecules/EmptyState/EmptyState";

// Page shown for unknown URLs (the "*" route).
function NotFoundPage() {
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <EmptyState
        icon="🧭"
        title="Page not found"
        message="The page you are looking for does not exist."
        actionLabel="Go to Home"
        onAction={() => navigate("/")}
      />
    </MainLayout>
  );
}

export default NotFoundPage;
