export interface RawTicker {
  type: 'v2/ticker';
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
  type: 'l2_orderbook';
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

export interface RawTrade {
  type: 'all_trades';
  symbol: string;
  price: string;
  size: number;
  buyer_role: 'maker' | 'taker';
  timestamp: number;
}