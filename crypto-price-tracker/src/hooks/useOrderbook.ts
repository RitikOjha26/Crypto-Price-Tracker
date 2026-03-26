import { useEffect } from 'react';
import type { OrderbookSnapshot } from '../types';
import type { RawOrderbook } from '../types/rawShapes';
import { mapOrderbook } from '../utils/mappers';
import { useWsContext } from '../store/WebSocketContext';
import { useThrottledState } from './useThrottledState';



export function useOrderbook(symbol: string) {

    const {service,status} = useWsContext();
    const [orderBook, setOrderBook] = useThrottledState<OrderbookSnapshot|null>(null);

    useEffect(()=>{
        if(status!='connected') return;

        service.subscribe('l2_orderbook',symbol);
        const remove = service.addmsgHandler((data)=>{
            const msg = data as RawOrderbook;
            if(msg.type === 'l2_orderbook' && msg.symbol === symbol)
            {
                setOrderBook(mapOrderbook(msg));
            }
        })

        return () =>{
            service.unsubscribe('l2_orderbook',symbol);
            remove();
        }
    }, [status, symbol, service, setOrderBook]);

  return orderBook;
}