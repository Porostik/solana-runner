import { useUnit } from 'effector-react';
import { authModel } from '../model';
import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

export const useVerifyPlayer = () => {
  const { loading, verify } = useUnit({
    verify: authModel.verifyFx,
    loading: authModel.loading,
  });

  const [isTWAActive, setIsTWAActive] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    const initData: string | undefined = tg?.initData;
    if (!tg) {
      setIsTWAActive(false);
      return;
    }
    tg.ready();
    tg.expand();
    if (!initData) {
      setIsTWAActive(false);
      return;
    }
    (async () => {
      try {
        await verify({ initData });
        setTimeout(() => {
          router.invalidate();
        }, 500);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [router]);

  return {
    loading,
    isTWAActive,
  };
};
