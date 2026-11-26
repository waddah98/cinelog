import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import IconButton from "../../atoms/IconButton/IconButton";
import "./Navbar.css";

// Organism: the main navigation bar shown on every page.
// It reads the number of saved movies directly from the Redux store with useSelector,
// so no page needs to pass it down through props.
//
// NavLink (from React Router) automatically adds the class "active"
// to the link of the page we are on. Navbar.css uses it to highlight the link.
function Navbar() {
  const watchlistCount = useSelector((state) => state.watchlist.items.length);

  // Local state: is the mobile menu open?
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  let linksClass = "navbar__links";
  if (isMenuOpen) {
    linksClass = linksClass + " navbar__links--open";
  }

  let menuIcon = "☰";
  let menuLabel = "Open menu";
  if (isMenuOpen) {
    menuIcon = "✕";
    menuLabel = "Close menu";
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">🎬</span>
          <span>CineTrack</span>
        </Link>

        <div className="navbar__toggle">
          <IconButton icon={menuIcon} label={menuLabel} onClick={toggleMenu} />
        </div>

        <nav>
          <ul className={linksClass}>
            <li>
              {/* "end" means: only active on exactly "/", not on every page. */}
              <NavLink to="/" end className="navbar__link" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className="navbar__link" onClick={closeMenu}>
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/watchlist" className="navbar__link" onClick={closeMenu}>
                Watchlist
                <span className="navbar__count">{watchlistCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className="navbar__link" onClick={closeMenu}>
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
