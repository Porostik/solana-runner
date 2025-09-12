import { playerModel } from '@/entity/player';
import { getLeaderboardFn } from '@/server-functions';
import { PageLoader } from '@/shared/ui/page-loader';
import { createFileRoute } from '@tanstack/react-router';
import { useUnit } from 'effector-react';

export const Route = createFileRoute('/_authed/leaderboard')({
  component: RouteComponent,
  loader: async () => {
    return await getLeaderboardFn();
  },
  pendingComponent: () => <PageLoader />,
});

function RouteComponent() {
  const { player } = useUnit({
    player: playerModel.player,
  });

  const leaderboardData = Route.useLoaderData();

  if (!player) return null;

  return (
    <div className="pt-14 bg-background flex w-full h-full items-center px-3 gap-4 flex-col">
      <span className="text-xs text-secondary-foreground">
        Your best score: {player.maxScore}
      </span>

      <div className="flex flex-col gap-y-4 w-full overflow-auto pb-5">
        {leaderboardData.map((p, idx) => (
          <div
            className="w-full text-xs flex text-secondary rounded-xl p-3 border border-secondary"
            key={p.name}
          >
            <span>{`${idx + 1}.${p.name}`}</span>
            {p.pubkey === player.pubkey && <span className="ml-5">You!</span>}
            <span className="ml-auto block">{p.maxScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
