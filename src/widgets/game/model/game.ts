import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { characterModel } from './character';
import { obstacleModule } from './obstacle';
import { hitObject } from './hit';
import { spawnObjectFabric } from './object';
import { coinModule } from './coin';
import { setScoreFn } from '@/feature/game';
import { playerModel } from '@/entity/player';

export type GameStatus = 'idle' | 'process';

const S_MIN = 1.0;
const S_MAX = 3.0;
const T50 = 30.0;
const T90 = 60.0;
const K = Math.log(9) / (T90 - T50);

const sigma = (x: number) => 1 / (1 + Math.exp(-K * (x - T50)));

const startGame = createEvent();
const stopGame = createEvent();

const getCoin = createEvent();

const $status = createStore<GameStatus>('idle')
  .on(startGame, () => 'process')
  .on(stopGame, () => 'idle');

const tick = createEvent<number>();
const resetT = createEvent();

const $t = createStore(0)
  .on(tick, (t, dt) => t + dt)
  .reset(resetT);

export const $timeScale = $t.map((t) => S_MIN + (S_MAX - S_MIN) * sigma(t));

const BASE_SPEED = 200;
export const $worldSpeed = $timeScale.map((ts) => BASE_SPEED * ts);
export const $worldOffset = createStore(0);

sample({
  clock: tick,
  source: { off: $worldOffset, v: $worldSpeed },
  fn: ({ off, v }, dt) => off + v * dt,
  target: $worldOffset,
});

const resetScore = createEvent();

const $baseScore = $worldOffset
  .reset(resetScore)
  .map((t) => Math.ceil(t * 0.3));

const $bonusScore = createStore(0)
  .on(getCoin, (state) => state + 200)
  .reset(resetScore);

const $score = combine($baseScore, $bonusScore, (base, bonus) => base + bonus);

let rafId: number | null = null;
let lastNow = 0;
let loopStarted = false;

const startGameLoopFx = createEffect(() => {
  if (loopStarted) return;
  lastNow = performance.now();
  const runnerEl = document.querySelector<HTMLElement>('.runner')!;
  const obstacleEl = document.querySelector<HTMLElement>('.obstacle')!;
  const coinEl = document.querySelector<HTMLElement>('.coin')!;

  const frame = (now: number) => {
    if ($status.getState() === 'idle') {
      loopStarted = false;
      return;
    }
    const dt = Math.min(0.032, (now - lastNow) / 1000);
    lastNow = now;
    if ($status.getState() === 'process') tick(dt);
    if (hitObject(runnerEl, obstacleEl)) stopGame();
    if (hitObject(runnerEl, coinEl)) getCoin();

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);
});

const setScoreFx = createEffect(
  async ({ score, pubkey }: { score: number; pubkey: string }) => {
    const { ok } = await setScoreFn({ data: { score, pubkey } });

    if (ok) {
      playerModel.setScore(score);
    }
  }
);

spawnObjectFabric({
  minGap: 4,
  jitter: 4,
  tick,
  ts: $timeScale,
  onShow: obstacleModule.show,
  isVisible: obstacleModule.isVisible,
});

spawnObjectFabric({
  minGap: 7,
  jitter: 7,
  tick,
  ts: $timeScale,
  onShow: coinModule.show,
  isVisible: coinModule.isVisible,
});

const cancelGameLoopFx = createEffect(() => {
  if (rafId) cancelAnimationFrame(rafId);
  loopStarted = false;
  rafId = null;
});

sample({
  clock: startGame,
  target: [startGameLoopFx, characterModel.run, resetScore],
});

sample({
  clock: stopGame,
  target: [
    cancelGameLoopFx,
    characterModel.idle,
    obstacleModule.hide,
    coinModule.hide,
    resetT,
  ],
});

sample({
  clock: stopGame,
  source: { score: $score, player: playerModel.player },
  fn: ({ score, player }) => ({ score, pubkey: player?.pubkey ?? '' }),
  target: setScoreFx,
});

sample({
  clock: getCoin,
  target: [coinModule.hide, coinModule.showBonusText],
});

const setPlaybackRateFx = createEffect<number, void>((rate) => {
  const runnerEl = document.querySelector<HTMLElement>('.runner');
  const bgEl = document.querySelector<HTMLElement>('.bg');
  const obstacleEl = document.querySelector<HTMLElement>('.obstacle');

  bgEl?.getAnimations().forEach((a) => (a.playbackRate = rate));
  runnerEl?.getAnimations().forEach((a) => (a.playbackRate = rate));
  obstacleEl?.getAnimations().forEach((a) => (a.playbackRate = rate));
});

sample({
  source: $timeScale,
  target: setPlaybackRateFx,
});

export const gameModel = {
  status: $status,
  score: $score,
  startGame,
};
