import { useEffect, useRef, useState } from "react";
import { useWsContext } from "../store/WebSocketContext";
import type { Trade } from "../types";
import type { RawTrade } from "../types/rawShapes";
import { mapTrade } from "../utils/mappers";
import { THROTTLE_MS } from "../constants";

const MAX_TRADES = 50;

export function useTrade(symbol: string) {

    const { service, status } = useWsContext();
    const [trades, setTrades] = useState<Trade[]>([]);

    const pendingRef = useRef<Trade[]>([]);
    const timingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (status !== 'connected') return;
        service.subscribe('all_trades', symbol);
        const remove = service.addmsgHandler((data) => {
            const msg = data as RawTrade;
            if (msg.type === 'all_trades' && msg.symbol === symbol) {
                pendingRef.current.unshift(mapTrade(msg));
                if (!timingRef.current) {
                    timingRef.current = setTimeout(() => {
                        timingRef.current = null;
                        const batch = pendingRef.current.splice(0);
                        if (batch.length) {
                            setTrades((prev) => [...batch, ...prev].slice(0, MAX_TRADES));
                        }
                    }, THROTTLE_MS);
                }
            }
        });

        return () => {
            service.unsubscribe('all_trades', symbol);
            if (timingRef.current) {
                clearTimeout(timingRef.current);
                timingRef.current = null;
            }
            pendingRef.current = [];
            remove();
        };
    }, [symbol, service, status]);

    return trades;
}

