import { processPlayerPda } from '@/entity/player';
import { solanaMiddleware } from '@/middlewares/solana';
import { verifyTelegramInitData } from '@/utils/verifyTelegramInitData';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createServerFn } from '@tanstack/react-start';
import { BN } from 'bn.js';

export const loginFn = createServerFn({ method: 'POST' })
  .middleware([solanaMiddleware])
  .validator((data: { name: string; tgData: string }) => data)
  .handler(async ({ data, context }) => {
    const initData = verifyTelegramInitData(
      data.tgData,
      process.env.TG_BOT_TOKEN!
    );

    if (!initData.ok || !initData.user) throw new Error('Something went wrong');

    const { sponsor, connection, program } = context.solana;

    const tgIdLE = Buffer.alloc(8);
    tgIdLE.writeBigUInt64LE(BigInt(initData.user.id));

    const [playerPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('tg'), tgIdLE],
      program.programId
    );

    const ix = await program.methods
      .initializePlayer(data.name, new BN(initData.user.id))
      .accounts({
        sponsor: sponsor.publicKey,
      })
      .signers([sponsor])
      .instruction();

    const { blockhash } = await connection.getLatestBlockhash();

    const tx = new Transaction();
    tx.add(ix);
    tx.recentBlockhash = blockhash;
    tx.sign(sponsor);

    const sig = await connection.sendRawTransaction(tx.serialize());

    await connection.confirmTransaction(sig, 'confirmed');

    const player = await program.account.player.fetch(playerPDA);

    return processPlayerPda(player);
  });
