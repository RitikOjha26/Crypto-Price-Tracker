import type { Ticker } from '../../types';
import { SYMBOL_DECIMALS } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { formatVolume } from '../../utils/formatVolume';

interface StatsStripProps {
  ticker: Ticker | null;
  symbol: string;
}

export default function StatsStrip({ ticker, symbol }: StatsStripProps) {
  const decimals = SYMBOL_DECIMALS[symbol] ?? 2;
  const dash = '\u2014';

  const fundingRate = ticker ? parseFloat(ticker.funding_rate) : 0;
  const fundingPositive = fundingRate >= 0;

  return (
    <div className="stats-strip">
      <div className="stats-strip__cell">
        <div className="stats-strip__label">Mark Price</div>
        <div className="stats-strip__value">
          {ticker ? `$${formatPrice(ticker.mark_price, decimals)}` : dash}
        </div>
      </div>

      <div className="stats-strip__cell">
        <div className="stats-strip__label">24H High</div>
        <div className="stats-strip__value stats-strip__value--up">
          {ticker ? `$${formatPrice(ticker.high, decimals)}` : dash}
        </div>
      </div>

      <div className="stats-strip__cell">
        <div className="stats-strip__label">24H Low</div>
        <div className="stats-strip__value stats-strip__value--down">
          {ticker ? `$${formatPrice(ticker.low, decimals)}` : dash}
        </div>
      </div>

      <div className="stats-strip__cell">
        <div className="stats-strip__label">24H Volume</div>
        <div className="stats-strip__value">
          {ticker ? `$${formatVolume(parseFloat(ticker.volume))}` : dash}
        </div>
      </div>

      <div className="stats-strip__cell">
        <div className="stats-strip__label">Funding Rate</div>
        <div className={`stats-strip__value ${fundingPositive ? 'stats-strip__value--up' : 'stats-strip__value--down'}`}>
          {ticker ? `${fundingPositive ? '+' : ''}${(fundingRate * 100).toFixed(4)}%` : dash}
        </div>
      </div>
    </div>
  );
}
