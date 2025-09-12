import { Game } from '@/widgets/game';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/game')({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return <Game />;
}
