import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_ITEMS = ["home", "about", "skills", "resume", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => scrollTo("home")}>
          <span className="logo-bracket">&lt;</span>
          Portfolio
          <span className="logo-bracket">/&gt;</span>
        </button>

        <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button className="nav-link" onClick={() => scrollTo(item)}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`nav-toggle ${menuOpen ? "nav-toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
