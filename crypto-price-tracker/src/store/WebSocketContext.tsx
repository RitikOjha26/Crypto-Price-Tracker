import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { WebSocketService, type ConnectionStatus } from "../services/WebSocketService";


interface WsContextValue {
    service: WebSocketService;
    status: ConnectionStatus;
    reconnect: () => void;
}

const WsContext = createContext<WsContextValue | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {

    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const WS_URL = import.meta.env.VITE_WEB_SOCKET_URL

    const service = useMemo(() => {
        return new WebSocketService(WS_URL, setStatus);
    },[WS_URL])

    useEffect(() => {
        service.connect();
        return () => service.disconnect();
    }, [service]);

    return (
    <WsContext.Provider value={{ service, status, reconnect: () => service.reconnect() }}>
      {children}
    </WsContext.Provider>
  );

}

export function useWsContext(): WsContextValue {
  const ctx = useContext(WsContext);
  if (!ctx) throw new Error('useWsContext must be used inside <WebSocketProvider>');
  return ctx;
}
