import { useEffect, useRef, useState } from 'react';
import type { Ticker } from '../types';
import type { RawTicker } from '../types/rawShapes';
import { useWsContext } from '../store/WebSocketContext';
import { THROTTLE_MS } from '../constants';



export function useAllTickers(symbols: readonly string[]) {
  const { service, status } = useWsContext();
  const [tickers, setTickers] = useState<Map<string, Ticker>>(new Map());

  const pendingRef = useRef<Map<string, Ticker>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const symbolSet = new Set(symbols);

    // Evict stale symbols when the list shrinks
    pendingRef.current.forEach((_, s) => { if (!symbolSet.has(s)) pendingRef.current.delete(s); });
    setTickers((prev) => {
      const stale = [...prev.keys()].filter((s) => !symbolSet.has(s));
      if (stale.length === 0) return prev;
      const next = new Map(prev);
      stale.forEach((s) => next.delete(s));
      return next;
    });

    const pending = pendingRef.current
    const remove = service.addmsgHandler((data) => {
      const msg = data as RawTicker;
      if (msg.type === 'v2/ticker' && symbols.includes(msg.symbol)) {
        pendingRef.current.set(msg.symbol, {
          symbol: msg.symbol,
          price: String(msg.close),
          mark_price: msg.mark_price,
          high: String(msg.high),
          low: String(msg.low),
          volume: String(msg.volume),
          change_24h: msg.ltp_change_24h,
          funding_rate: msg.funding_rate,
          quotes: msg.quotes,
          timestamp: msg.timestamp,
        });
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            const updates = new Map(pendingRef.current);
            pendingRef.current.clear();
            setTickers((prev) => {
              const next = new Map(prev);
              updates.forEach((t, s) => next.set(s, t));
              return next;
            });
          }, THROTTLE_MS);
        }
      }
    });

    return () => {
      const timer = timerRef.current;
      if (timer) { clearTimeout(timer); timerRef.current = null; }
      pending.clear();
      remove();
    };
  }, [service, symbols]);

  useEffect(() => {
    if (status !== 'connected') return;
    service.subscribeMany('v2/ticker', symbols);
    return () => {
      service.unsubscribeMany('v2/ticker', symbols);
    };
  }, [status, service, symbols]);

  return tickers;
}
