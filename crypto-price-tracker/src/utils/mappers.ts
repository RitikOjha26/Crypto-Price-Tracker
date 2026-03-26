import type { RawOrderbook, RawTicker, RawTrade } from "../types/rawShapes";
import type { Ticker, OrderbookSnapshot, Trade } from "../types";

export function mapTicker(raw: RawTicker): Ticker {
    return {
        symbol: raw.symbol,
        price: String(raw.close),
        mark_price: raw.mark_price,
        high: String(raw.high),
        low: String(raw.low),
        volume: String(raw.volume),
        change_24h: raw.ltp_change_24h,
        funding_rate: raw.funding_rate,
        quotes: raw.quotes,
        timestamp: raw.timestamp,
    };
}

export function mapOrderbook(raw: RawOrderbook): OrderbookSnapshot {
    return {
        symbol: raw.symbol,
        bids: raw.bids.map(([price, size]) => ({ price, size })),
        asks: raw.asks.map(([price, size]) => ({ price, size })),
        timestamp: raw.timestamp,
    };
}

export function mapTrade(raw: RawTrade): Trade {
    return {
        symbol: raw.symbol,
        price: raw.price,
        size: raw.size,
        side: raw.buyer_role === 'taker' ? 'buy' : 'sell',
        timestamp: raw.timestamp,
    };
}