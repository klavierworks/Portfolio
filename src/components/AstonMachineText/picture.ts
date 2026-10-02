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

// The effects are sized to the text, but the pixel grid is not, so on small text they smear strokes only a pixel or two wide.
// Returns 1 at or above fullEffectSize device pixels, falling off faster than the text below it.
export function effectStrength(host: HTMLElement, config: PictureConfig) {
  const deviceFontSize = parseFloat(getComputedStyle(host).fontSize) * (devicePixelRatio || 1);
  return Math.min(1, (deviceFontSize / config.fullEffectSize) ** config.effectFalloff);
}
