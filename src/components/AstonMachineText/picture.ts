import type { PictureConfig } from './config';

// The picture is drawn small and scaled up so it is never sharper than the reference, and the host is sized to match.
// Everything follows the font size, so the look depends on the text alone and not on the window.
export function layoutPicture(host: HTMLElement, picture: HTMLElement, config: PictureConfig, referenceFontSize: number) {
  const fontSize = parseFloat(getComputedStyle(host).fontSize);
  const deviceScale = fontSize * (devicePixelRatio || 1) / referenceFontSize;
  const displayScale = Math.max(1, deviceScale / config.maxDeviceScale);
  picture.style.transform = `scale(${displayScale})`;
  picture.style.setProperty('--display-scale', String(displayScale));
  host.style.width = `${picture.offsetWidth * displayScale}px`;
  host.style.height = `${picture.offsetHeight * displayScale}px`;
  return displayScale;
}
