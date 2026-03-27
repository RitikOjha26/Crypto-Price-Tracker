import type { ConnectionStatus as Status } from '../../services/WebSocketService';

interface ConnectionStatusProps {
  status: Status;
  onReconnect?: () => void;
}

export default function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const isConnected = status === 'connected';
  const showRetry = (status === 'disconnected' || status === 'error') && onReconnect;

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
      {showRetry && (
        <button
          onClick={onReconnect}
          style={{
            marginLeft: '0.5rem',
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            border: '1px solid currentColor',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
