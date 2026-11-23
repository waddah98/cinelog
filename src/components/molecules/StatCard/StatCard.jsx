import "./StatCard.css";

// Molecule: one statistic, for example "Watched: 4".
// - icon: optional Lucide icon element
// - description: optional small text under the number
function StatCard({ label, value, icon, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        {icon && <span className="stat-card__icon">{icon}</span>}
        <span className="stat-card__label">{label}</span>
      </div>
      <p className="stat-card__value">{value}</p>
      {description && <p className="stat-card__description">{description}</p>}
    </div>
  );
}

export default StatCard;
