/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import appCss from '@/styles/app.css?url';
import { verifyTelegramInitData } from '@/utils/verifyTelegramInitData';
import { PublicKey } from '@solana/web3.js';
import { solanaMiddleware } from '@/middlewares/solana';
import { BN } from 'bn.js';
import { playerModel, processPlayerPda } from '@/entity/player';
import { PageLoader } from '@/shared/ui/page-loader';
import { RouterContextBridge } from '@/feature/bridge';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: () => <RootDocument />,
  beforeLoad: async () => {
    if (!playerModel.player.getState()) {
      try {
        const player = await verifyUser({ data: { initData: '' } });
        playerModel.setPlayer(player);
        return {
          player,
        };
      } catch (error) {
        return {
          player: null,
        };
      }
    }

    return {
      player: playerModel.player.getState(),
    };
  },
  ssr: false,
  pendingComponent: () => <PageLoader />,
});

const verifyUser = createServerFn({ method: 'POST' })
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

function RootDocument() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <RouterContextBridge />
        <Scripts />
      </body>
    </html>
  );
}
