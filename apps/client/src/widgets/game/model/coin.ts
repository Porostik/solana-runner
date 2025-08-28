import { createEvent, createStore } from 'effector';
import { delay } from 'patronum';
import { objectFabric } from './object';

const m = objectFabric('coin');

const show = createEvent();
const hide = createEvent();

const $isBonusTextShow = createStore(false)
  .on(show, () => true)
  .on(hide, () => false);

delay({
  source: show,
  timeout: 1000,
  target: hide,
});

export const coinModule = {
  ...m,
  isBonusTextShow: $isBonusTextShow,
  showBonusText: show,
};
