// ── WebSocket protocol ────────────────────────────────────────────────────────

export type Channel =
  | 'v2/ticker'
  | 'l2_orderbook'
  | 'all_trades'
  | `candlestick_${string}`;

export interface WsSubscribeMessage {
  type: 'subscribe';
  payload: { channels: Array<{ name: Channel; symbols: string[] }> };
}

export interface WsUnsubscribeMessage {
  type: 'unsubscribe';
  payload: { channels: Array<{ name: Channel; symbols: string[] }> };
}

export type WsOutboundMessage = WsSubscribeMessage | WsUnsubscribeMessage;

// ── Domain models (matched to socket-custom-load generator output) ─────────────

export interface Ticker {
  symbol: string;
  /** Last traded price (socket field: `close`) */
  price: string;
  mark_price: string;
  high: string;
  low: string;
  /** Total volume (socket field: `volume`) */
  volume: string;
  /** 24h price change ratio e.g. "1.0234" (socket field: `ltp_change_24h`) */
  change_24h: string;
  funding_rate: string;
  quotes: {
    best_ask: string;
    best_bid: string;
  };
  timestamp: number;
}

export interface OrderbookLevel {
  price: string;
  size: string;
}

export interface OrderbookSnapshot {
  symbol: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  timestamp: number;
}

export interface Trade {
  symbol: string;
  price: string;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface Candle {
  symbol: string;
  resolution: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  timestamp: number;
}

// ── Display helpers ────────────────────────────────────────────────────────────

export const SYMBOLS = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'SOLUSD', 'PAXGUSD', 'DOGEUSD'] as const;
export type SymbolId = typeof SYMBOLS[number];

export const SYMBOL_NAMES: Record<string, string> = {
  BTCUSD: 'Bitcoin',
  ETHUSD: 'Ethereum',
  XRPUSD: 'XRP',
  SOLUSD: 'Solana',
  PAXGUSD: 'PAX Gold',
  DOGEUSD: 'Dogecoin',
};

export const SYMBOL_DECIMALS: Record<string, number> = {
  BTCUSD: 1,
  ETHUSD: 2,
  XRPUSD: 4,
  SOLUSD: 4,
  PAXGUSD: 2,
  DOGEUSD: 6,
};
