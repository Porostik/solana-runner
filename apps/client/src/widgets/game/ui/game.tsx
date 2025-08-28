import { Button } from '@/shared/ui/button';
import { useUnit } from 'effector-react';
import { gameModel } from '../model/game';
import { GameBackground } from './background';
import { Character } from './character';
import { characterModel } from '../model/character';
import { Obstacle } from './obstacle';
import { Coin } from './coin';
import { BonusText } from './bonus-text';

export const Game = () => {
  const { score, status, startGame } = useUnit(gameModel);
  const { jump } = useUnit(characterModel);

  return (
    <div
      className="w-full h-full relative"
      onClick={status === 'process' ? jump : undefined}
    >
      <div className="absolute z-10 top-10 left-1/2 -translate-x-1/2 flex flex-col text-center gap-4 items-center">
        <div className="flex flex-col text-center gap-2">
          <span>Your score:</span>
          <span>{score}</span>
        </div>
        {status !== 'process' && (
          <Button className="w-[120px] h-10" onClick={startGame}>
            Start
          </Button>
        )}
      </div>

      <Character />
      <GameBackground />
      <Obstacle />
      <Coin />
      <BonusText />
    </div>
  );
};
