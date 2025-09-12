import {
  createEffect,
  createEvent,
  createStore,
  EventCallable,
  sample,
  Store,
} from 'effector';

export const objectFabric = (className: string) => {
  const show = createEvent<number>();
  const hide = createEvent();

  const $isVisible = createStore<boolean>(false)
    .on(show, () => {
      return true;
    })
    .on(hide, () => false);

  let rafId: number | null = null;

  const getObjectEl = () => {
    return document.querySelector<HTMLElement>(`.${className}`);
  };

  const setAnimationFx = createEffect((rate: number) => {
    const objectEl = getObjectEl()!;

    if (!objectEl) return;

    let x = window.innerWidth;
    let v = 300 * rate;
    let last = performance.now();
    const w = objectEl.offsetWidth;
    const accel = 60;

    function loop(now: number) {
      let dt = (now - last) / 1000;
      if (dt > 0.032) dt = 0.032;
      last = now;
      v += accel * dt;
      x -= v * dt;
      objectEl.style.opacity = '1';

      if (x < -w) {
        x = window.innerWidth;
        hide();
        objectEl.style.transform = `translate3d(${Math.round(x)}px,0,0)`;
        objectEl.style.opacity = '0';

        return;
      }

      objectEl.style.transform = `translate3d(${Math.round(x)}px,0,0)`;

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
  });

  const cancelAnimationFx = createEffect(() => {
    const obstacleEl = getObjectEl()!;
    obstacleEl.style.opacity = '0';
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  });

  sample({
    clock: show,
    target: setAnimationFx,
  });

  sample({
    clock: hide,
    target: cancelAnimationFx,
  });

  return {
    isVisible: $isVisible,
    show,
    hide,
  };
};

export const spawnObjectFabric = ({
  minGap,
  jitter,
  onShow,
  tick,
  ts,
  isVisible,
}: {
  minGap: number;
  jitter: number;
  onShow: EventCallable<number>;
  ts: Store<number>;
  tick: EventCallable<number>;
  isVisible: Store<boolean>;
}) => {
  const nextDelay = () => minGap + Math.random() * jitter;

  const $cd = createStore(nextDelay()).on(tick, (cd, dt) => {
    return Math.max(0, cd - Math.min(dt, 0.032));
  });

  sample({
    clock: tick,
    source: { cd: $cd, visible: isVisible, ts },
    filter: ({ cd, visible }) => {
      return cd === 0 && !visible;
    },
    fn: ({ ts }) => ts,
    target: onShow,
  });

  sample({
    clock: onShow,
    fn: nextDelay,
    target: $cd,
  });
};
