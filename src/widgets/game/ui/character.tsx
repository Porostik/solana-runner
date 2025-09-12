import { CSSProperties } from 'react';
import { useUnit } from 'effector-react';
import Run from '@/shared/assets/sprites/character_run.png';
import Idle from '@/shared/assets/sprites/character_idle.png';
import Jump from '@/shared/assets/sprites/character_jump.png';
import { cn } from '@/shared/utils/cn';
import { characterModel, State } from '../model/character';

const states: Record<State, { img: string; frames: number }> = {
  idle: {
    img: Idle,
    frames: 4,
  },
  run: {
    img: Run,
    frames: 6,
  },
  jump: {
    img: Jump,
    frames: 4,
  },
} as const;

export const Character = () => {
  const { state } = useUnit(characterModel);

  const activeState = states[state];

  return (
    <div
      className={cn(
        'absolute character h-[100px] w-[100px] bottom-0 ease-out left-2 z-20 will-change-transform',
        {
          'animate-sprite-jump-up': state === 'jump',
        }
      )}
      style={
        {
          '--sprite-duration': '0.8s',
          '--frame-max-y': '-170px',
        } as CSSProperties
      }
    >
      <div
        className={cn(
          'runner sprite-run animate-sprite-run bg-no-repeat w-full h-full absolute left-0 bottom-0'
        )}
        style={
          {
            '--frame-w': '100px',
            '--frames': activeState.frames,
            '--sprite-duration': '1s',
            backgroundImage: `url(${activeState.img})`,
            backgroundSize: 'calc(var(--frame-w) * var(--frames)) 100px',
          } as CSSProperties
        }
      />
      <div
        className={cn(
          'runner-jump sprite-run animate-sprite-jump opacity-0 w-full h-full bg-no-repeat absolute left-0 bottom-0'
        )}
        style={
          {
            '--frame-w': '100px',
            '--frames': activeState.frames,
            backgroundImage: `url(${activeState.img})`,
            backgroundSize: 'calc(var(--frame-w) * var(--frames)) 100px',
          } as CSSProperties
        }
      />
      <div className="absolute w-[55%] h-[75%] box-runner bottom-1" />
    </div>
  );
};
