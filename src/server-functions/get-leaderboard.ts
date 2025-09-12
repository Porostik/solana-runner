import { processPlayerPda } from '@/entity/player';
import { solanaMiddleware } from '@/middlewares/solana';
import { createServerFn } from '@tanstack/react-start';

export const getLeaderboardFn = createServerFn({ method: 'GET' })
  .middleware([solanaMiddleware])
  .handler(async ({ context }) => {
    const { program, leaderboardPDA } = context.solana;

    const leaderboard = await program.account.leaderboard.fetch(leaderboardPDA);

    const players = await program.account.player.fetchMultiple(
      leaderboard.topPlayers.map((p) => p.pubkey)
    );

    return players
      .map((p) => (p ? processPlayerPda(p) : null))
      .filter((p) => !!p);
  });
