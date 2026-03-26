import { useNavigate } from 'react-router-dom';
import { Star, Sun, Moon, ChevronRight } from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';

interface DetailNavbarProps {
  symbol: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function DetailNavbar({
  symbol,
  isFavorite,
  onToggleFavorite,
}: DetailNavbarProps) {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <nav className="detail-navbar">
      <a className="detail-navbar__brand" onClick={() => navigate('/')}>
        <span className="detail-navbar__brand-icon" aria-hidden="true" />
        <span className="detail-navbar__brand-name">
          Crypto<span className="detail-navbar__brand-accent">Lens</span>
        </span>
      </a>

      <span className="detail-navbar__sep" />

      <div className="detail-navbar__breadcrumb">
        <a
          className="detail-navbar__breadcrumb-link"
          onClick={() => navigate('/')}
        >
          Markets
        </a>
        <ChevronRight className="detail-navbar__breadcrumb-sep" size={14} />
        <span className="detail-navbar__breadcrumb-current">{symbol}</span>
      </div>

      <div className="detail-navbar__actions">
        <button
          className={`detail-navbar__action-btn ${isFavorite ? 'detail-navbar__action-btn--fav-active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          <span>Watchlist</span>
        </button>

        <button
          className="detail-navbar__action-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span>Theme</span>
        </button>
      </div>
    </nav>
  );
}
