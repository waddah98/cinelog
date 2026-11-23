import Navbar from "../../components/organisms/Navbar/Navbar";
import "./MainLayout.css";

// Template: the shared page shell (navigation + main content + footer).
// It does not know anything about movies; the page puts its content inside as `children`.
// - watchlistCount: passed to the Navbar badge
function MainLayout({ watchlistCount = 0, children }) {
  return (
    <div className="main-layout">
      <Navbar watchlistCount={watchlistCount} />
      <main className="main-layout__content container">{children}</main>
      <footer className="main-layout__footer">
        <div className="container">
          CineTrack — a React examination project. All movie data is local mock data.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
