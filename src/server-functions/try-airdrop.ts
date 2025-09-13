import { solanaMiddleware } from '@/middlewares/solana';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createServerFn } from '@tanstack/react-start';

export const tryAirdropSponsorFn = createServerFn({ method: 'POST' })
  .middleware([solanaMiddleware])
  .handler(async ({ context }) => {
    try {
      const { connection, sponsor } = context.solana;

      const airdropSig = await connection.requestAirdrop(
        sponsor.publicKey,
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSig);
    } catch (error) {
      console.error(error);
    }
  });
