import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Clapperboard, Menu, X } from "lucide-react";
import IconButton from "../../atoms/IconButton/IconButton";
import "./Navbar.css";

// Organism: the main navigation bar shown on every page.
// - watchlistCount: number shown next to the "Watchlist" link
//
// NavLink (from React Router) automatically adds the class "active"
// to the link of the page we are on. Navbar.css uses it to highlight the link.
function Navbar({ watchlistCount = 0 }) {
  // Local UI state: is the mobile menu open?
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

  let menuIcon = <Menu size={20} />;
  let menuLabel = "Open menu";
  if (isMenuOpen) {
    menuIcon = <X size={20} />;
    menuLabel = "Close menu";
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <Clapperboard size={24} aria-hidden="true" />
          <span>CineTrack</span>
        </Link>

        <div className="navbar__toggle">
          <IconButton
            icon={menuIcon}
            label={menuLabel}
            onClick={toggleMenu}
            ariaExpanded={isMenuOpen}
          />
        </div>

        <nav aria-label="Main navigation">
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
