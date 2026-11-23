import { useNavigate } from "react-router-dom";
import { MapPinOff } from "lucide-react";
import { useWatchlist } from "../../hooks/useWatchlist";
import MainLayout from "../../templates/MainLayout/MainLayout";
import EmptyState from "../../components/molecules/EmptyState/EmptyState";

// Fallback for unknown URLs. This is an error state, not one of the five main pages.
function NotFoundPage() {
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  return (
    <MainLayout watchlistCount={watchlist.length}>
      <EmptyState
        icon={<MapPinOff size={40} />}
        title="Page not found"
        message="The page you are looking for does not exist."
        actionLabel="Go to Home"
        onAction={() => navigate("/")}
      />
    </MainLayout>
  );
}

export default NotFoundPage;
