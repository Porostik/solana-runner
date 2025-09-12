/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import appCss from '@/styles/app.css?url';
import { playerModel } from '@/entity/player';
import { PageLoader } from '@/shared/ui/page-loader';
import { RouterContextBridge } from '@/feature/bridge';
import { useVerifyPlayer } from '@/feature/auth';
import { TgError } from '@/shared/ui/tg-error';

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
    const player =
      typeof window !== 'undefined' ? playerModel.player.getState() : null;

    return {
      player: player,
    };
  },
  pendingComponent: () => <PageLoader />,
});

function RootDocument() {
  const { loading, isTWAActive, error } = useVerifyPlayer();

  return (
    <html>
      <head>
        <HeadContent />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        <RouterContextBridge />
        {error && <span className="text-secondary">{error}</span>}
        {!isTWAActive && <TgError />}
        {loading && isTWAActive && <PageLoader />}
        {!loading && isTWAActive && <Outlet />}
        <Scripts />
      </body>
    </html>
  );
}
