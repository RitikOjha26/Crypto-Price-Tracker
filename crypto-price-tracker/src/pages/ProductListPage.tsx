import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllTickers } from '../hooks/useAllTickers';
import { useFavorite } from '../hooks/useFavorite';
import { useTheme } from '../store/ThemeContext';
import { useWsContext } from '../store/WebSocketContext';
import { SYMBOLS, SYMBOL_NAMES } from '../types';
import { ProductList } from '../components/ProductList';
import { ListNavbar } from '../components/ListNavbar';

type Filter = 'all' | 'favorites';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { status, reconnect } = useWsContext();
  const { theme } = useTheme();
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

  const statusLabel =
    status === 'connected'
      ? 'Connected'
      : status === 'connecting'
      ? 'Connecting\u2026'
      : 'Disconnected';

  return (
    <div className="page" data-theme={theme}>
      <ListNavbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__status">
          <span className={`status-dot status-dot--${status}`} aria-hidden="true" />
          <span className={`hero__status-label${status === 'disconnected' ? ' hero__status-label--muted' : ''}`}>
            {statusLabel}
          </span>
          {(status === 'disconnected' || status === 'error') && (
            <button className="hero__retry-btn" onClick={reconnect} aria-label="Retry connection">
              Retry
            </button>
          )}
        </div>
        <h1 className="hero__title">Live Crypto Markets</h1>
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
