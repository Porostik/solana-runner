/// <reference types="@twa-dev/types" />
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultErrorComponent: () => <div>Error</div>,
    defaultNotFoundComponent: () => <div>Not found</div>,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
