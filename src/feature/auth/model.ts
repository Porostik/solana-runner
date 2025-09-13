import { playerModel } from '@/entity/player';
import { verifyUserFn } from '@/server-functions';
import { atom } from '@/shared/utils/atom';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const authModel = atom(() => {
  const setLoading = createEvent<boolean>();

  const $loading = createStore(true).on(setLoading, (_, loading) => loading);

  const verifyFx = createEffect(async ({ initData }: { initData: string }) => {
    const player = await verifyUserFn({ data: { initData } });
    return player;
  });

  sample({
    clock: verifyFx.done,
    fn: (v) => v.result,
    target: playerModel.setPlayer,
  });

  sample({
    clock: verifyFx.pending,
    fn: () => true,
    target: setLoading,
  });

  sample({
    clock: verifyFx.done,
    fn: () => false,
    target: setLoading,
  });

  sample({
    clock: verifyFx.fail,
    fn: () => false,
    target: setLoading,
  });

  return {
    loading: $loading,
    verifyFx,
  };
});
