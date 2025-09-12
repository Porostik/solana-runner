import { createServerFileRoute } from '@tanstack/react-start/server';
import { json } from '@tanstack/react-start';

export const ServerRoute = createServerFileRoute('/api/check-player').methods({
  POST: async ({ params, request }) => {},
});
