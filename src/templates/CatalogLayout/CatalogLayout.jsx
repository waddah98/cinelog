import MainLayout from "../MainLayout/MainLayout";
import "./CatalogLayout.css";

// Template: the layout for catalog pages (Explore).
// It reuses MainLayout and places: heading -> filters -> results.
// - filters: the filter area (a React element, for example <FilterPanel />)
// - children: the results area (for example <MovieGrid />)
function CatalogLayout({ watchlistCount, title, description, filters, children }) {
  return (
    <MainLayout watchlistCount={watchlistCount}>
      <div className="catalog-layout">
        <header className="page-header">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </header>
        <div className="catalog-layout__filters">{filters}</div>
        <section className="catalog-layout__results" aria-label="Results">
          {children}
        </section>
      </div>
    </MainLayout>
  );
}

export default CatalogLayout;
