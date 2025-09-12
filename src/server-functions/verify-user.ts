import { processPlayerPda } from '@/entity/player';
import { solanaMiddleware } from '@/middlewares/solana';
import { verifyTelegramInitData } from '@/utils/verifyTelegramInitData';
import { PublicKey } from '@solana/web3.js';
import { createServerFn } from '@tanstack/react-start';

export const verifyUserFn = createServerFn({ method: 'POST' })
  .middleware([solanaMiddleware])
  .validator((data: { initData: string }) => data)
  .handler(async ({ data, context }) => {
    const initData = verifyTelegramInitData(
      data.initData,
      process.env.BOT_TOKEN!
    );

    if (!initData.ok || !initData.user) throw new Error('Something went wrong');

    const { program } = context.solana;

    const tgIdLE = Buffer.alloc(8);
    tgIdLE.writeBigUInt64LE(initData.user.id);

    const [playerPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('tg'), tgIdLE],
      program.programId
    );

    const player = await program.account.player.fetch(playerPDA);

    return processPlayerPda(player);
  });
