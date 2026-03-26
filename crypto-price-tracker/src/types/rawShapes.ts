export interface RawTicker {
  type: string;
  symbol: string;
  close: number;
  mark_price: string;
  high: number;
  low: number;
  volume: number;
  ltp_change_24h: string;
  funding_rate: string;
  quotes: { best_ask: string; best_bid: string };
  timestamp: number;
}

export interface RawOrderbook {
  type: string;
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

export interface RawTrade {
  type: string;
  symbol: string;
  price: string;
  size: number;
  buyer_role: 'maker' | 'taker';
  timestamp: number;
}