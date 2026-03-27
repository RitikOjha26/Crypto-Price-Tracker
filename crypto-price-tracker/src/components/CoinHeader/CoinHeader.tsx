import { useRef, useEffect } from 'react';
import { SYMBOL_NAMES, SYMBOL_DECIMALS } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { parseChange24h } from '../../utils/parseChange';

interface CoinHeaderProps {
  symbol: string;
  price: string | null;
  change24h: string | null;
}

export default function CoinHeader({ symbol, price, change24h }: CoinHeaderProps) {
  const name = SYMBOL_NAMES[symbol] ?? symbol;
  const decimals = SYMBOL_DECIMALS[symbol] ?? 2;
  const change = parseChange24h(change24h);
  const isPositive = change >= 0;

  const priceRef = useRef<HTMLSpanElement>(null);
  const prevPriceRef = useRef<string | null>(null);

  useEffect(() => {
    if (price && price !== prevPriceRef.current && priceRef.current) {
      priceRef.current.classList.remove('coin-header__price--flash');
      void priceRef.current.offsetWidth;
      priceRef.current.classList.add('coin-header__price--flash');
    }
    prevPriceRef.current = price;
  }, [price]);

  return (
    <div className="coin-header">
      <div className="coin-header__identity">
        <div className="coin-header__icon" aria-hidden="true">
          {name[0]}
        </div>
        <div>
          <div className="coin-header__title-row">
            <span className="coin-header__symbol">{symbol}</span>
            <span className="coin-header__tag">Perpetual</span>
          </div>
          <div className="coin-header__subtitle">
            {name} &middot; Inverse Perpetual Contract
          </div>
        </div>
      </div>

      <div className="coin-header__price-block">
        <span ref={priceRef} className="coin-header__price">
          {price ? `$${formatPrice(price, decimals)}` : '\u2014'}
        </span>
        {change24h && (
          <div>
            <span
              className={`coin-header__change ${isPositive ? 'coin-header__change--up' : 'coin-header__change--down'}`}
            >
              {isPositive ? '\u25B2' : '\u25BC'} {Math.abs(change).toFixed(2)}% today
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
