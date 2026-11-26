import { useEffect } from "react";
import Navbar from "../../components/organisms/Navbar/Navbar";
import "./MainLayout.css";

// Template: the shared page shell (navigation + main content + footer).
// It does not know anything about movies; the page puts its content inside as `children`.
function MainLayout({ children }) {
  // When a new page is shown (mount), scroll back to the top.
  // Without this, opening a movie from the bottom of Home would keep the old scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main-layout">
      <Navbar />
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
