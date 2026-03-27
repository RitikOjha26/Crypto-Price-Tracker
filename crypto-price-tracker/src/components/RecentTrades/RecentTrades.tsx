import { memo, useRef, useEffect, useMemo } from 'react';
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

  const prevKeySetRef = useRef<Set<string>>(new Set());
  const bodyRef = useRef<HTMLDivElement>(null);

  const newKeys = useMemo(() => {
    const currentIds = new Set(trades.map((t) => t.id));
    const fresh = new Set([...currentIds].filter((id) => !prevKeySetRef.current.has(id)));
    return fresh;
  }, [trades]);

  useEffect(() => {
    prevKeySetRef.current = new Set(trades.map((t) => t.id));
  }, [trades]);

  useEffect(() => { prevKeySetRef.current = new Set(); }, [symbol]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [trades]);

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
        <div className="recent-trades__body" ref={bodyRef}>
          {trades.map((trade) => (
            <div
              key={trade.id}
              className={`recent-trades__row${newKeys.has(trade.id) ? ' recent-trades__row--new' : ''}`}
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
