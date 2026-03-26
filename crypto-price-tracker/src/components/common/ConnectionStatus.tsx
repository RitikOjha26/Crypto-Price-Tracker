import type { ConnectionStatus as Status } from '../../services/WebSocketService';

interface ConnectionStatusProps {
  status: Status;
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  const isConnected = status === 'connected';
  return (
    <div className={`ws-status ${status}`}>
      <span className="ws-dot" />
      <span>
        {isConnected
          ? 'WebSocket connected · Live updates active'
          : status === 'connecting'
          ? 'Connecting…'
          : status === 'error'
          ? 'Connection error'
          : 'Disconnected'}
      </span>
    </div>
  );
}
