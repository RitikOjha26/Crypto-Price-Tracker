import { useMemo, memo, useRef, useEffect } from 'react';
import type { OrderbookSnapshot } from '../../types';
import { SYMBOL_DECIMALS } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

interface OrderbookProps {
  orderbook: OrderbookSnapshot | null;
  symbol: string;
}

interface ProcessedLevel {
  price: string;
  size: string;
  total: number;
  depthPct: number;
}

function Orderbook({ orderbook, symbol }: OrderbookProps) {
  const decimals = SYMBOL_DECIMALS[symbol] ?? 2;
  const maxLevels = 10;

  const asksRef = useRef<HTMLDivElement>(null);
  const bidsRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      if (asksRef.current) asksRef.current.scrollTop = asksRef.current.scrollHeight;
      if (bidsRef.current) bidsRef.current.scrollTop = 0;
    }, 1500);

    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [orderbook]);

  const { asks, bids, spread, spreadPct, midPrice } = useMemo(() => {
    if (!orderbook) {
      return { asks: [], bids: [], spread: null, spreadPct: null, midPrice: null };
    }

    const processLevels = (
      levels: { price: string; size: string }[],
    ): ProcessedLevel[] => {
      let cumTotal = 0;
      const processed = levels.slice(0, maxLevels).flatMap((level) => {
        const sizeNum = parseFloat(level.size);
        if (isNaN(sizeNum)) return [];
        cumTotal += sizeNum;
        return [{
          price: level.price,
          size: level.size,
          total: cumTotal,
          depthPct: 0,
        }];
      });

      const maxTotal = cumTotal;
      for (const row of processed) {
        row.depthPct = maxTotal > 0 ? (row.total / maxTotal) * 100 : 0;
      }

      return processed;
    };

    const sortedAsks = [...orderbook.asks]
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    const sortedBids = [...orderbook.bids]
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    const processedAsks = processLevels(sortedAsks);
    const processedBids = processLevels(sortedBids);

    const lowestAsk = sortedAsks[0] ? parseFloat(sortedAsks[0].price) : null;
    const highestBid = sortedBids[0] ? parseFloat(sortedBids[0].price) : null;

    let sp = null;
    let spPct = null;
    let mid = null;

    if (lowestAsk !== null && highestBid !== null) {
      sp = lowestAsk - highestBid;
      mid = (lowestAsk + highestBid) / 2;
      spPct = mid > 0 ? (sp / mid) * 100 : 0;
    }

    return {
      asks: processedAsks,
      bids: processedBids,
      spread: sp,
      spreadPct: spPct,
      midPrice: mid,
    };
  }, [orderbook]);

  return (
    <div className="orderbook">
      <div className="orderbook__header">
        <span className="orderbook__title">Orderbook</span>
        <span className="orderbook__live-badge">
          <span className="orderbook__live-dot" />
          Live
        </span>
      </div>

      <div className="orderbook__columns">
        <span className="orderbook__col-label">Price (USD)</span>
        <span className="orderbook__col-label">Size</span>
        <span className="orderbook__col-label">Total</span>
      </div>

      {!orderbook ? (
        <div className="orderbook__empty">Waiting for orderbook data&hellip;</div>
      ) : (
        <>
          {/* Asks — column-reverse so lowest ask is at the bottom near spread */}
          <div className="orderbook__asks" ref={asksRef}>
            {asks.map((level) => (
              <div
                key={`ask-${level.price}`}
                className="orderbook__row orderbook__row--ask"
              >
                <div
                  className="orderbook__depth-bar"
                  style={{ width: `${level.depthPct}%` }}
                />
                <span className="orderbook__cell orderbook__cell--price">
                  {formatPrice(level.price, decimals)}
                </span>
                <span className="orderbook__cell orderbook__cell--size">
                  {parseFloat(level.size).toFixed(4)}
                </span>
                <span className="orderbook__cell orderbook__cell--total">
                  {level.total.toFixed(4)}
                </span>
              </div>
            ))}
          </div>

          {/* Spread + mid price */}
          {spread !== null && (
            <div className="orderbook__spread">
              <span className="orderbook__spread-label">Spread</span>
              <span className="orderbook__spread-value">
                ${formatPrice(spread, decimals)}
              </span>
              <span className="orderbook__spread-pct">
                ({spreadPct?.toFixed(3) ?? '0.000'}%)
              </span>
            </div>
          )}

          {midPrice !== null && (
            <div className="orderbook__mid">
              <span className="orderbook__mid-label">Last</span>
              <span className="orderbook__mid-value">
                ${formatPrice(midPrice, decimals)}
              </span>
            </div>
          )}

          {/* Bids */}
          <div className="orderbook__bids" ref={bidsRef}>
            {bids.map((level) => (
              <div
                key={`bid-${level.price}`}
                className="orderbook__row orderbook__row--bid"
              >
                <div
                  className="orderbook__depth-bar"
                  style={{ width: `${level.depthPct}%` }}
                />
                <span className="orderbook__cell orderbook__cell--price">
                  {formatPrice(level.price, decimals)}
                </span>
                <span className="orderbook__cell orderbook__cell--size">
                  {parseFloat(level.size).toFixed(4)}
                </span>
                <span className="orderbook__cell orderbook__cell--total">
                  {level.total.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Orderbook);
