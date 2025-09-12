import { playerModel } from '@/entity/player';
import { useRouteContext } from '@tanstack/react-router';
import { useEffect } from 'react';

export const RouterContextBridge = () => {
  const player = useRouteContext({ from: '__root__', select: (s) => s.player });

  useEffect(() => {
    player && playerModel.setPlayer(player);
  }, [player]);

  return null;
};
