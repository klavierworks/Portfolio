import type { PictureConfig } from './config';

export function layoutPicture(host: HTMLElement, picture: HTMLElement, config: PictureConfig) {
  const height = host.getBoundingClientRect().height;
  if (!height) return undefined;
  const rows = Math.min(height, config.maxDeviceRows / (devicePixelRatio || 1));
  const displayScale = height / rows;
  picture.style.width = `${rows * config.referenceWidth / config.referenceHeight}px`;
  picture.style.height = `${rows}px`;
  picture.style.transform = `scale(${displayScale})`;
  picture.style.setProperty('--display-scale', String(displayScale));
  return { scale: rows / config.referenceHeight, displayScale };
}
