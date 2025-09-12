import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { playerModel } from '@/entity/player';
import { LoginForm } from '@/feature/login/ui/form';
import { loginFn } from '@/server-functions';

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
    const tg = (window as any)?.Telegram?.WebApp;
    const initData: string = tg?.initData;
    const player = await loginFn({ data: { tgData: initData, name } });
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
