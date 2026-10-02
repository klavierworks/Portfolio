import { installReactRefresh } from './installReactRefresh';

const IDLE_TIMEOUT_MILLISECONDS = 2000;

const waitForPageLoad = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    window.addEventListener('load', () => resolve(), { once: true });
  });

const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const waitForIdle = () =>
  new Promise<void>((resolve) => {
    if (!('requestIdleCallback' in window)) {
      setTimeout(resolve, 200);
      return;
    }
    requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MILLISECONDS });
  });

const getElement = (selector: string) => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`TheRear needs ${selector} on the page`);
  }
  return element;
};

// React, TheRear and FF8 are only requested once the page has loaded and the text animation is
// already drawing, so none of it competes with the first render.
export const scheduleTheRear = async () => {
  await waitForPageLoad();
  await waitForFrame();
  await waitForFrame();
  await waitForIdle();

  await installReactRefresh();
  const { mountTheRear } = await import('./mountTheRear');
  mountTheRear({
    closeLink: getElement('[data-rear-close]'),
    overlay: getElement('[data-rear-overlay]'),
    rear: getElement('[data-rear]'),
    returnControl: getElement('[data-rear-return]'),
    returnLink: getElement('[data-rear-return-link]'),
    status: getElement('[data-rear-status]'),
  });
};
