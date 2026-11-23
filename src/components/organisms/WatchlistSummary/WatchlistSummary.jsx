import { Bookmark, CheckCircle, Clock } from "lucide-react";
import StatCard from "../../molecules/StatCard/StatCard";
import "./WatchlistSummary.css";

// Organism: three StatCards with the watchlist counts.
// The numbers are calculated by the page from the current watchlist,
// so they are always up to date.
function WatchlistSummary({ total, planned, watched }) {
  return (
    <div className="watchlist-summary">
      <StatCard
        label="In watchlist"
        value={total}
        icon={<Bookmark size={18} aria-hidden="true" />}
        description="Movies you have saved"
      />
      <StatCard
        label="Planned"
        value={planned}
        icon={<Clock size={18} aria-hidden="true" />}
        description="Waiting to be watched"
      />
      <StatCard
        label="Watched"
        value={watched}
        icon={<CheckCircle size={18} aria-hidden="true" />}
        description="Movies you have finished"
      />
    </div>
  );
}

export default WatchlistSummary;
