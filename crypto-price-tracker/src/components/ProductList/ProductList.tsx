import { useMemo } from 'react';
import type { Ticker } from '../../types';
import ProductListRow from './ProductListRow';

interface ProductListProps {
  tickers: Map<string, Ticker>;
  symbols: readonly string[];
  onSelect: (symbol: string) => void;
  favorites: { isFavorite: (s: string) => boolean };
  onToggleFavorite: (symbol: string) => void;
}

export default function ProductList({
  tickers,
  symbols,
  onSelect,
  favorites,
  onToggleFavorite,
}: ProductListProps) {
  const rows = useMemo(() => {
    return symbols.map((symbol, index) => ({
      symbol,
      rank: index + 1,
      index,
      ticker: tickers.get(symbol),
    }));
  }, [tickers, symbols]);

  return (
    <div className="product-list" role="region" aria-label="Crypto assets table">
      <table className="product-list__table">
        <thead>
          <tr>
            <th className="product-list__th product-list__col--rank">#</th>
            <th className="product-list__th product-list__col--symbol">Asset</th>
            <th className="product-list__th product-list__col--price">Price</th>
            <th className="product-list__th product-list__col--price-change">Price / 24h</th>
            <th className="product-list__th product-list__col--change">24H Change</th>
            <th className="product-list__th product-list__col--volume">Vol</th>
            <th className="product-list__th product-list__col--fav" aria-label="Favorite" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="product-list__empty">
                No coins match your search.
              </td>
            </tr>
          ) : (
            rows.map(({ symbol, rank, index, ticker }) => (
              <ProductListRow
                key={symbol}
                symbol={symbol}
                rank={rank}
                index={index}
                ticker={ticker}
                isFavorite={favorites.isFavorite(symbol)}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
