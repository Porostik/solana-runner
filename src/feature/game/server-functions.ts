import { solanaMiddleware } from '@/middlewares/solana';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createServerFn } from '@tanstack/react-start';
import { BN } from 'bn.js';

export const setScoreFn = createServerFn({ method: 'POST' })
  .middleware([solanaMiddleware])
  .validator((data: { score: number; pubkey: string }) => data)
  .handler(async ({ data, context }) => {
    const { connection, program, sponsor, leaderboardPDA } = context.solana;

    const playerPubkey = new PublicKey(data.pubkey);

    const updatePlayerScoreIx = await program.methods
      .updatePlayerBestScore(new BN(data.score))
      .accounts({
        sponsor: sponsor.publicKey,
        player: playerPubkey,
      })
      .instruction();
    const updateLeaderboardIx = await program.methods
      .updateLeaderboard()
      .accounts({
        sponsor: sponsor.publicKey,
        player: playerPubkey,
        leaderboard: leaderboardPDA,
      })
      .instruction();

    const { blockhash } = await connection.getLatestBlockhash();

    const tx = new Transaction();
    tx.add(updatePlayerScoreIx);
    tx.add(updateLeaderboardIx);
    tx.recentBlockhash = blockhash;
    tx.sign(sponsor);

    const sig = await connection.sendRawTransaction(tx.serialize());

    await connection.confirmTransaction(sig, 'confirmed');

    return { ok: true };
  });
