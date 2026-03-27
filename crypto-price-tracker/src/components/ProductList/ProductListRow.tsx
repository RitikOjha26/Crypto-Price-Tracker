import { memo } from 'react';
import { Star } from 'lucide-react';
import type { Ticker } from '../../types';
import { SYMBOL_NAMES, SYMBOL_DECIMALS, SYMBOL_TICKERS, COIN_COLORS } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { formatVolume } from '../../utils/formatVolume';

interface ProductListRowProps {
  symbol: string;
  rank: number;
  index: number;
  ticker: Ticker | undefined;
  isFavorite: boolean;
  onSelect: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

function ProductListRow({
  symbol,
  rank,
  index,
  ticker,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: ProductListRowProps) {
  const name = SYMBOL_NAMES[symbol] ?? symbol;
  const decimals = SYMBOL_DECIMALS[symbol] ?? 2;
  const ticker_display = SYMBOL_TICKERS[symbol] ?? symbol.replace('USD', '');
  const coinColor = COIN_COLORS[symbol] ?? '#6c7fff';
  const change = (parseFloat(ticker?.change_24h ?? '1') - 1) * 100;
  const isPositive = change >= 0;

  return (
    <tr
      className="product-list__row"
      style={{ animationDelay: `${index * 0.03}s` }}
      onClick={() => onSelect(symbol)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(symbol)}
      aria-label={`View ${name} details`}
    >
      <td className="product-list__td product-list__col--rank">
        <span className="product-list__rank">{rank}</span>
      </td>

      <td className="product-list__td product-list__col--symbol">
        <div className="product-list__asset">
          <span
            className="product-list__asset-initial"
            aria-hidden="true"
            style={{
              background: `${coinColor}2e`,
              color: coinColor,
            }}
          >
            {name[0]}
          </span>
          <div className="product-list__asset-info">
            <span className="product-list__asset-name">{name}</span>
            <span className="product-list__asset-symbol">{ticker_display}</span>
          </div>
        </div>
      </td>

      <td className="product-list__td product-list__col--price">
        <span className="product-list__price">
          {ticker ? `$${formatPrice(ticker.price, decimals)}` : '\u2014'}
        </span>
      </td>

      {/* Mobile-only: price + 24h change stacked */}
      <td className="product-list__td product-list__col--price-change">
        <div className="product-list__price-change-stack">
          <span className="product-list__price">
            {ticker ? `$${formatPrice(ticker.price, decimals)}` : '\u2014'}
          </span>
          {ticker ? (
            <span className={`product-list__badge ${isPositive ? 'product-list__badge--up' : 'product-list__badge--down'}`}>
              <span aria-hidden="true">{isPositive ? '\u25B2' : '\u25BC'}</span>
              {Math.abs(change).toFixed(2)}%
            </span>
          ) : (
            <span className="product-list__placeholder">{'\u2014'}</span>
          )}
        </div>
      </td>

      <td className="product-list__td product-list__col--change">
        {ticker ? (
          <span className={`product-list__badge ${isPositive ? 'product-list__badge--up' : 'product-list__badge--down'}`}>
            <span aria-hidden="true">
              {isPositive ? '\u25B2' : '\u25BC'}
            </span>
            {Math.abs(change).toFixed(2)}% 
          </span>
        ) : (
          <span className="product-list__placeholder">{'\u2014'}</span>
        )}
      </td>

      <td className="product-list__td product-list__col--volume">
        <span className="product-list__volume">
          {ticker ? `$${formatVolume(parseFloat(ticker.volume))}` : '\u2014'}
        </span>
      </td>

      <td
        className="product-list__td product-list__col--fav"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(symbol); }}
      >
        <button
          className={`product-list__fav-btn ${isFavorite ? 'product-list__fav-btn--active' : ''}`}
          aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          tabIndex={-1}
        >
          <Star
            size={16}
            aria-hidden="true"
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </td>
    </tr>
  );
}

export default memo(ProductListRow);
