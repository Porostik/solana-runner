import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { verifyTelegramInitData } from '@/utils/verifyTelegramInitData';
import { solanaMiddleware } from '@/middlewares/solana';
import { BN } from 'bn.js';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { playerModel, processPlayerPda } from '@/entity/player';
import { LoginForm } from '@/feature/login/ui/form';

const loginFn = createServerFn({ method: 'POST' })
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
    tgIdLE.writeBigUInt64LE(initData.user.id);

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

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  ssr: false,
  beforeLoad: ({ context }) => {
    if (context.player) {
      return redirect({ to: '/game' });
    }
  },
});

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();

  const onSubmit = async ({ name }: { name: string }) => {
    const player = await loginFn({ data: { tgData: '', name } });
    playerModel.setPlayer(player);
    router.invalidate();
    navigate({
      to: '/game',
    });
  };

  return (
    <div className="w-full h-full bg-background flex items-center justify-center">
      <div className="flex flex-col w-[350px]">
        <LoginForm onSubmit={onSubmit} />;
      </div>
    </div>
  );
}
