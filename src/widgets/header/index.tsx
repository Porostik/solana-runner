import { playerModel } from '@/entity/player';
import { Button } from '@/shared/ui/button';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useUnit } from 'effector-react';

export const Header = () => {
  const { player } = useUnit({
    player: playerModel.player,
  });

  const navigate = useNavigate();

  const pathname = useRouterState().location.pathname;

  const isGameRoute = pathname === '/game';

  if (!player) return null;

  return (
    <div className="w-full bg-background h-10 flex justify-between items-center p-3 absolute top-0 left-0 z-10">
      <span className="text-[10px] text-secondary">{player.name}</span>

      <Button
        className="p-2"
        onClick={() => navigate({ to: isGameRoute ? '/leaderboard' : '/game' })}
      >
        {isGameRoute ? 'Leaderboard' : 'Game'}
      </Button>
    </div>
  );
};
