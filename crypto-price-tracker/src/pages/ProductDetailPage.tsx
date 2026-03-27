import { useParams, Navigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useTheme } from '../store/ThemeContext';
import { useFavorite } from '../hooks/useFavorite';
import { DetailNavbar } from '../components/DetailNavbar';
import { CoinHeader } from '../components/CoinHeader';
import { StatsStrip } from '../components/StatsStrip';
import { Orderbook } from '../components/Orderbook';
import { RecentTrades } from '../components/RecentTrades';
import { SYMBOLS, type SymbolId } from '../types';
import ConnectionStatus from '../components/common/ConnectionStatus';
import { useWsContext } from '../store/WebSocketContext';

export default function ProductDetailPage() {
  const { status , reconnect } = useWsContext()
  const { symbol } = useParams<{ symbol: string }>();
  const safeSymbol = symbol?.toUpperCase() ?? '';

  if (!SYMBOLS.includes(safeSymbol as SymbolId)) {
    return <Navigate to="/" replace />;
  }
  const { ticker, orderbook, trades } = useProductDetail(safeSymbol);
  const { theme } = useTheme();
  const favorites = useFavorite();

  return (
    <div className="page" data-theme={theme}>
      <DetailNavbar
        symbol={safeSymbol}
        isFavorite={favorites.isFavorite(safeSymbol)}
        onToggleFavorite={() => favorites.toggle(safeSymbol)}
      />

      <main className="detail">
        <CoinHeader
          symbol={safeSymbol}
          price={ticker?.mark_price ?? null}
          change24h={ticker?.change_24h ?? null}
        />

        <StatsStrip ticker={ticker} symbol={safeSymbol} />

        <div className="detail__grid">
          <Orderbook orderbook={orderbook} symbol={safeSymbol} />
          <RecentTrades trades={trades} symbol={safeSymbol} />
        </div>

        <div className="connection_pill">
          <ConnectionStatus status={status} onReconnect={reconnect} />
        </div>
      </main>
    </div>
  );
}
