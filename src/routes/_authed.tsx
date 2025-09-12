import { Header } from '@/widgets/header';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.player) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="w-full h-full">
      <Header />
      <Outlet />
    </div>
  );
}
