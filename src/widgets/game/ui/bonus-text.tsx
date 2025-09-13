import { cn } from '@/shared/utils/cn';
import { useUnit } from 'effector-react';
import { coinModule } from '../model/coin';

export const BonusText = () => {
  const { isBonusTextShow } = useUnit(coinModule);

  return (
    <div
      className={cn(
        'absolute w-full flex justify-center bottom-[158px] opacity-0 text-secondary text-lg',
        {
          'animate-bonus': isBonusTextShow,
        }
      )}
    >
      +200
    </div>
  );
};
