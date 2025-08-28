import CoinImg from '@/shared/assets/sprites/solana.png';
import { CSSProperties } from 'react';
import { cn } from '@/shared/utils/cn';

export const Coin = () => {
  return (
    <div
      className={cn(
        'absolute coin bottom-[150px] opacity-0 bg-no-repeat bg-cover bg-center will-change-transform border border-secondary rounded-full'
      )}
      style={
        {
          '--obs-w': `${55}px`,
          backgroundImage: `url(${CoinImg})`,
          width: 55,
          height: 55,
        } as CSSProperties
      }
    >
      <div className="coin-box absolute w-full h-full" />
    </div>
  );
};
