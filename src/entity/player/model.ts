import { atom } from '@/shared/utils/atom';
import { createEvent, createStore } from 'effector';
import { Player } from './types';

export const playerModel = atom(() => {
  const setPlayer = createEvent<Player | null>();
  const setScore = createEvent<number>();

  const $player = createStore<Player | null>(null)
    .on(setPlayer, (_, player) => player)
    .on(setScore, (player, score) =>
      player
        ? {
            ...player,
            maxScore: player.maxScore < score ? score : player.maxScore,
          }
        : null
    );

  return {
    player: $player,
    setPlayer,
    setScore,
  };
});
