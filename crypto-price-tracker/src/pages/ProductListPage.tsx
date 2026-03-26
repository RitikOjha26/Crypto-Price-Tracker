import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, Star, Sun, Moon } from 'lucide-react';
import { useAllTickers } from '../hooks/useAllTickers';
import { useFavorite } from '../hooks/useFavorite';
import { useTheme } from '../store/ThemeContext';
import { useWsContext } from '../store/WebSocketContext';
import { SYMBOLS, SYMBOL_NAMES } from '../types';
import { ProductList } from '../components/ProductList';


type Filter = 'all' | 'favorites';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { status } = useWsContext();
  const { theme, toggle: toggleTheme } = useTheme();
  const favorites = useFavorite();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const tickers = useAllTickers(SYMBOLS);

  const filtered = useMemo(() => {
    let list = [...SYMBOLS] as string[];

    if (filter === 'favorites') {
      list = list.filter((s) => favorites.isFavorite(s));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          (SYMBOL_NAMES[s] ?? s).toLowerCase().includes(q) ||
          s.toLowerCase().includes(q)
      );
    }

    return list;
  }, [filter, search, favorites.isFavorite]);

  return (
    <div className="page" data-theme={theme}>
      {/* ── Header ── */}
      <header className="header">
        <div className="header__brand">
          <span className="header__brand-icon" aria-hidden="true" />
          <span className="header__brand-name">
            Crypto<span className="header__brand-accent">Lens</span>
          </span>
        </div>

        <label className="header__search" aria-label="Search coins">
          <Search className="header__search-icon" size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="header__search-input"
          />
        </label>

        <nav className="header__nav" aria-label="Filter and theme">
          <button
            className={`header__nav-btn ${filter === 'all' ? 'header__nav-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <LayoutGrid size={14} aria-hidden="true" />
            All
          </button>
          <button
            className={`header__nav-btn ${filter === 'favorites' ? 'header__nav-btn--active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            <Star size={14} aria-hidden="true" />
            Favorites
          </button>
          <button className="header__nav-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <Sun size={14} aria-hidden="true" />
            ) : (
              <Moon size={14} aria-hidden="true" />
            )}
            Theme
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <h1 className="hero__title">
          <span className={`status-dot status-dot--${status}`} aria-label={`Connection: ${status}`} />
          Live Crypto Markets
        </h1>
        <p className="hero__subtitle">
          Real-time prices across {SYMBOLS.length} assets
        </p>
      </section>

      {/* ── Table ── */}
      <section className="page__table-section">
        <ProductList
          tickers={tickers}
          symbols={filtered}
          onSelect={(symbol) => navigate(`/${symbol}`)}
          favorites={favorites}
          onToggleFavorite={favorites.toggle}
        />
      </section>
    </div>
  );
}
