import Background from '@/shared/assets/background.png';
import { useUnit } from 'effector-react';
import { gameModel } from '../model/game';
import { cn } from '@/shared/utils/cn';

export const GameBackground = () => {
  const { gameStatus } = useUnit({
    gameStatus: gameModel.status,
  });

  return (
    <div
      className={cn('absolute w-full h-full z-1 bg', {
        paused: gameStatus !== 'process',
      })}
      style={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'repeat-x',
      }}
    />
  );
};
