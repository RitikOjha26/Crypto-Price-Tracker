import { memo } from 'react';
import type { Trade } from '../../types';
import { SYMBOL_DECIMALS } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { formatTime } from '../../utils/formatTime';

interface RecentTradesProps {
  trades: Trade[];
  symbol: string;
}

function RecentTrades({ trades, symbol }: RecentTradesProps) {
  const decimals = SYMBOL_DECIMALS[symbol] ?? 2;

  return (
    <div className="recent-trades">
      <div className="recent-trades__header">
        <span className="recent-trades__title">Recent Trades</span>
        <span className="recent-trades__count-badge">
          {trades.length} trades
        </span>
      </div>

      <div className="recent-trades__columns">
        <span className="recent-trades__col-label">Price (USD)</span>
        <span className="recent-trades__col-label">Size</span>
        <span className="recent-trades__col-label">Side</span>
        <span className="recent-trades__col-label">Time</span>
      </div>

      {trades.length === 0 ? (
        <div className="recent-trades__empty">Waiting for trades&hellip;</div>
      ) : (
        <div className="recent-trades__body">
          {trades.map((trade) => (
            <div
              key={`${trade.timestamp}-${trade.price}-${trade.side}`}
              className="recent-trades__row"
            >
              <span
                className={`recent-trades__cell ${
                  trade.side === 'buy'
                    ? 'recent-trades__cell--price-buy'
                    : 'recent-trades__cell--price-sell'
                }`}
              >
                {formatPrice(trade.price, decimals)}
              </span>
              <span className="recent-trades__cell recent-trades__cell--size">
                {trade.size.toFixed(4)}
              </span>
              <span className="recent-trades__cell">
                <span
                  className={`recent-trades__side-chip ${
                    trade.side === 'buy'
                      ? 'recent-trades__side-chip--buy'
                      : 'recent-trades__side-chip--sell'
                  }`}
                >
                  {trade.side.toUpperCase()}
                </span>
              </span>
              <span className="recent-trades__cell recent-trades__cell--time">
                {formatTime(trade.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(RecentTrades);
