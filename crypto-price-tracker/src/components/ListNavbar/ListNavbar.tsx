import { useState } from 'react';
import { Search, LayoutGrid, Star, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';

type Filter = 'all' | 'favorites';

interface ListNavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export default function ListNavbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: ListNavbarProps) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="list-navbar-wrapper">
        <header className="list-navbar">
          <div className="list-navbar__brand">
            <span className="list-navbar__brand-icon" aria-hidden="true" />
            <span className="list-navbar__brand-name">
              Crypto<span className="list-navbar__brand-accent">Lens</span>
            </span>
          </div>

          {/* Full search bar — desktop */}
          <label className="list-navbar__search" aria-label="Search coins">
            <Search className="list-navbar__search-icon" size={14} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search coin…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="list-navbar__search-input"
            />
            <kbd className="list-navbar__search-kbd">⌘K</kbd>
          </label>

          {/* Search icon button — mobile only */}
          <button
            className="list-navbar__search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          <nav className="list-navbar__nav" aria-label="Filter and theme">
            <button
              className={`list-navbar__nav-btn ${filter === 'all' ? 'list-navbar__nav-btn--active' : ''}`}
              onClick={() => onFilterChange('all')}
            >
              <LayoutGrid size={15} aria-hidden="true" />
              <span>All</span>
            </button>
            <button
              className={`list-navbar__nav-btn ${filter === 'favorites' ? 'list-navbar__nav-btn--active' : ''}`}
              onClick={() => onFilterChange('favorites')}
            >
              <Star size={15} aria-hidden="true" />
              <span>Favorites</span>
            </button>
            <button className="list-navbar__nav-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Sun size={15} aria-hidden="true" />
              ) : (
                <Moon size={15} aria-hidden="true" />
              )}
              <span>Theme</span>
            </button>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className="list-navbar__hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {menuOpen && (
          <div className="list-navbar__mobile-menu">
            <button
              className={`list-navbar__mobile-menu-btn ${filter === 'all' ? 'list-navbar__mobile-menu-btn--active' : ''}`}
              onClick={() => { onFilterChange('all'); setMenuOpen(false); }}
            >
              <LayoutGrid size={16} aria-hidden="true" />
              <span>All</span>
            </button>
            <button
              className={`list-navbar__mobile-menu-btn ${filter === 'favorites' ? 'list-navbar__mobile-menu-btn--active' : ''}`}
              onClick={() => { onFilterChange('favorites'); setMenuOpen(false); }}
            >
              <Star size={16} aria-hidden="true" />
              <span>Favorites</span>
            </button>
            <button
              className="list-navbar__mobile-menu-btn"
              onClick={() => { toggleTheme(); setMenuOpen(false); }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              <span>Theme</span>
            </button>
          </div>
        )}
      </div>

      {/* Search modal — mobile only */}
      {searchOpen && (
        <div
          className="search-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={() => setSearchOpen(false)}
        >
          <div className="search-modal__sheet" onClick={(e) => e.stopPropagation()}>
            <label className="search-modal__input-wrap" aria-label="Search coins">
              <Search className="search-modal__icon" size={18} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search coin…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-modal__input"
                autoFocus
              />
            </label>
            <button
              className="search-modal__close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
