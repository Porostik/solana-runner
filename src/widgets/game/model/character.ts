import { createEffect, createEvent, createStore, sample } from 'effector';
import { delay } from 'patronum/delay';

export type State = 'idle' | 'run' | 'jump';

const idle = createEvent();
const run = createEvent();
const jump = createEvent();
const startJump = createEvent();

const $state = createStore<State>('idle')
  .on(idle, () => 'idle')
  .on(run, () => 'run')
  .on(jump, () => 'jump');

const jumpToRunFx = createEffect(() => {
  if ($state.getState() !== 'idle') {
    run();
  } else {
    idle();
    makeRun();
  }
});

delay({
  source: jump,
  timeout: 700,
  target: jumpToRunFx,
});

const makeJump = createEffect(() => {
  const jumpEl = document.querySelector<HTMLDivElement>('.runner-jump');
  const runEl = document.querySelector<HTMLDivElement>('.runner');

  if (!jumpEl || !runEl) return;

  const [jumpAnim] = jumpEl.getAnimations();

  jumpAnim.currentTime = 0;
  jumpAnim.play();

  runEl.style.opacity = '0';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      jumpEl.style.opacity = '1';
    });
  });
});

const makeRun = createEffect(() => {
  const jumpEl = document.querySelector<HTMLDivElement>('.runner-jump');
  const runEl = document.querySelector<HTMLDivElement>('.runner');

  if (!jumpEl || !runEl) return;

  jumpEl.style.opacity = '0';
  runEl.style.opacity = '1';
});

sample({
  clock: startJump,
  source: { state: $state },
  filter: ({ state }) => state !== 'jump',
  target: jump,
});

sample({
  clock: run,
  target: makeRun,
});

sample({
  clock: jump,
  source: { state: $state },
  filter: ({ state }) => state !== 'jump',
  target: makeJump,
});

export const characterModel = {
  state: $state,
  idle,
  run,
  jump: startJump,
};
