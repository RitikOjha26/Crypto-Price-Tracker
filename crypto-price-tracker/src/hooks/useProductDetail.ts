import { useEffect, useState, useRef } from "react";
import type { Ticker, OrderbookSnapshot, Trade } from "../types";
import type { RawOrderbook, RawTicker, RawTrade } from "../types/rawShapes";
import { mapTrade, mapOrderbook, mapTicker } from "../utils/mappers";
import { MAX_TRADES, THROTTLE_MS } from "../constants";
import { useWsContext } from "../store/WebSocketContext";
import { useThrottledState } from "./useThrottledState";

type RawMessage = RawTicker | RawOrderbook | RawTrade;

export function useProductDetail(symbol: string) {
    const { service, status } = useWsContext();

    const [ticker, setTicker] = useThrottledState<Ticker | null>(null);
    const [orderbook, setOrderbook] = useThrottledState<OrderbookSnapshot | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);

    const pendingTradesRef = useRef<Trade[]>([]);
    const tradesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (status !== 'connected') return;

        const channels = [
            { name: 'v2/ticker' as const, symbols: [symbol] },
            { name: 'l2_orderbook' as const, symbols: [symbol] },
            { name: 'all_trades' as const, symbols: [symbol] },
        ];

        service.subscribeChannels(channels);

        const remove = service.addmsgHandler((data) => {
            const msg = data as RawMessage;

            if (msg.symbol !== symbol) return;

            if (msg.type === 'v2/ticker') {
                const t = msg as RawTicker; 
                setTicker(mapTicker(t));
            }
            else if (msg.type === 'l2_orderbook') {
                const t = msg as RawOrderbook; 
                setOrderbook(mapOrderbook(t));
            }
            else if (msg.type === 'all_trades') {
                const t = msg as RawTrade; 
                pendingTradesRef.current.unshift(mapTrade(t));
                if (!tradesTimerRef.current) {
                    tradesTimerRef.current = setTimeout(() => {
                        tradesTimerRef.current = null;
                        const batch = pendingTradesRef.current.splice(0);
                        if (batch.length) {
                            setTrades((prev) => [...batch, ...prev].slice(0, MAX_TRADES));
                        }
                    }, THROTTLE_MS);
                }
            }
        })

        return () => {
            service.unsubscribeChannels(channels);
            if(tradesTimerRef.current){
                clearTimeout(tradesTimerRef.current)
                tradesTimerRef.current = null;
            }
            pendingTradesRef.current = [];
            remove();
        }
    },[symbol, service, status])

    return { ticker, orderbook, trades };

}